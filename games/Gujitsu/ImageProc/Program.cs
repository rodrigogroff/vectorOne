using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Collections.Generic;
using System.Drawing.Drawing2D;

namespace ImageProc
{
    class Program
    {
        static void Main(string[] args)
        {            
            Console.WriteLine("----------------- Image Processing -------------");
            Console.WriteLine(">> Cmd ('build' for all)");

            // ---------------------------------------------------------------------------
            // minimizar numero de arquivos em um ( +- 50% tamanho, +- 80% tempo load)
            // ---------------------------------------------------------------------------

            var dest = Console.ReadLine(); 

            if (dest == "build")
            {
                ProcF("Players\\Blue", "cw_blue");
                ProcF("Players\\Red", "cw_red");

                Console.WriteLine();
                Console.WriteLine(">> ------ Build Complete! ------------");
                Console.WriteLine();
            }
            else
            {
                Console.WriteLine(">> Prefixo do arquivo");

                var prefix = Console.ReadLine();

                Proc(dest, prefix);
            }

            Console.ReadLine();
        }

        static void ProcF(string destino, string prefix)
        {
            string BaseApp = "CrossPlat";
            string currentDir = Directory.GetCurrentDirectory() + "\\" + BaseApp + "\\Content\\Images\\";
            
            currentDir = currentDir.Replace("ImageProc\\bin\\Release\\", "");

            string dir = currentDir + destino;

            Console.WriteLine(dir);

            if (!Directory.Exists(dir))
            {
                Console.WriteLine("Diretório não existe");
                return;
            }

            var myFilesList = new DirectoryInfo(dir).GetFiles().OrderBy(y => y.FullName).ToArray();

            if (myFilesList.Length < 3)
                return;

            int totFrames = myFilesList.Length;                

            string fileTargetName = dir + "\\" + prefix + "_min.bin",
                    fileTargetNameMap = dir + "\\" + prefix + "_min.txt";

            Console.WriteLine(" >> PROC FULL => " + fileTargetName);

            if (File.Exists(fileTargetName))
            {
                totFrames--;
                File.Delete(fileTargetName);
            }

            if (File.Exists(fileTargetNameMap))
            {
                totFrames--;
                File.Delete(fileTargetNameMap);
            }

            Console.WriteLine(" totFrames => " + totFrames);

            List<byte[]> finalFile = new List<byte[]>();

            using (var sw = new StreamWriter(fileTargetNameMap))
            {
                int xCustomAcc = 0;
                
                foreach (var currentFrame in myFilesList)
                {
                    if (currentFrame.FullName.EndsWith(".txt")) continue;
                    if (currentFrame.FullName.Contains("min.")) continue;

                    bool pass = false;

                    for (int i = 0; i < 20; i++)
                        if (currentFrame.FullName.Contains("0" + i.ToString().PadLeft(2, '0') + ".tif"))
                        {
                            pass = true;
                            break;
                        }

                    if (pass)
                        continue;                            

                    Console.WriteLine(" currentFrame => " + currentFrame.FullName);

                    // obter dados do original

                    var sampleItem = new Bitmap(currentFrame.FullName);

                    int minX = 99999, maxX = 0;
                    int minY = 99999, maxY = 0;

                    using (Graphics grD = Graphics.FromImage(sampleItem))
                    {
                        for (int y = 0; y < sampleItem.Height; y++)
                            for (int x = 0; x < sampleItem.Width; ++x)
                            {
                                Color utd = sampleItem.GetPixel(x, y);

                                if (utd.A > 0)
                                {
                                    if (x < minX) minX = x;
                                    if (x > maxX) maxX = x;

                                    if (y < minY) minY = y;
                                    if (y > maxY) maxY = y;
                                }
                            }
                    }

                    if (minY > 0 ) minY--;
                    if (maxY < sampleItem.Height - 1) maxY++;
                    if (minX > 0) minX--;
                    if (maxX < sampleItem.Width - 1) maxX++;

                    int curSafeWidth = maxX - minX;
                    int curSafeHeight = maxY - minY;

                    Bitmap finalBitmap = new Bitmap(curSafeWidth, curSafeHeight);

                    using (Graphics grD = Graphics.FromImage(finalBitmap))
                    {
                        Rectangle destRegion = new Rectangle(0, 0, curSafeWidth, curSafeHeight);
                        Rectangle srcRegion = new Rectangle(minX, minY, curSafeWidth, curSafeHeight);

                        grD.DrawImage(sampleItem, destRegion, srcRegion, GraphicsUnit.Pixel);
                    }

                    using (var stream = new MemoryStream())
                    {
                        finalBitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Png);

                        var ar = stream.ToArray();

                        sw.WriteLine(curSafeWidth + "," + curSafeHeight + "," + minX + "," + minY + "," + ar.Length);

                        finalFile.Add(ar);
                    }
                }
            }

            byte[] rv = new byte[finalFile.Sum(a => a.Length)];
            int offset = 0;
            foreach (byte[] array in finalFile)
            {
                System.Buffer.BlockCopy(array, 0, rv, offset, array.Length);
                offset += array.Length;
            }

            File.WriteAllBytes("test.bin", rv);
            File.Move("test.bin", fileTargetName);

            Console.WriteLine(" >> Salvo com sucesso! ");
            Console.WriteLine();
        }

        static void ProcX(string destino, string prefix)
        {
            string BaseApp = "CrossPlat";
            string currentDir = Directory.GetCurrentDirectory() + "\\" + BaseApp + "\\Content\\Images\\";
            currentDir = currentDir.Replace("ImageProc\\bin\\Release\\", "");
            string dir = currentDir + destino;

            Console.WriteLine(dir);

            if (!Directory.Exists(dir))
            {
                Console.WriteLine("Diretório não existe");
                return;
            }

            var myFilesList = new DirectoryInfo(dir).GetFiles().OrderBy( y=> y.FullName ).ToArray();

            if (myFilesList.Length < 3)
                return;

            int totFrames = myFilesList.Length,
                widthPadrao = 0,
                totHeight = 0;

            using (var sample = new Bitmap(dir + "\\" + myFilesList[3]))
            {
                widthPadrao = sample.Width;
                totHeight = sample.Height;
            }

            string fileTargetName = dir + "\\" + prefix + "_min.png",
                    fileTargetNameMap = dir + "\\" + prefix + "_min.txt";

            Console.WriteLine(" >> target mini => " + fileTargetName);
            
            if (File.Exists(fileTargetName))
            {
                totFrames--;
                File.Delete(fileTargetName);
            }

            if (File.Exists(fileTargetNameMap))
            {
                totFrames--;
                File.Delete(fileTargetNameMap);
            }            

            Console.WriteLine(" widthPadrao => " + widthPadrao);
            Console.WriteLine(" totFrames => " + totFrames);
            Console.WriteLine(" totHeight => " + totHeight);
            
            int totXSizeMax = 0;
            int minY = 99999, maxY = 0;

            using (var sw = new StreamWriter(fileTargetNameMap))
            {
                foreach (var currentFrame in myFilesList)
                {
                    if (currentFrame.FullName.EndsWith(".txt"))
                        continue;
                    if (currentFrame.FullName.Contains("min."))
                        continue;

                    var sampleItem = new Bitmap(currentFrame.FullName);
                   
                    int minX = 99999, maxX = 0;                   

                    for (int y = 0; y < totHeight; y++)
                        for (int x = 0; x < widthPadrao; ++x)
                        {
                            Color utd = sampleItem.GetPixel(x, y);

                            if (utd.A > 0)
                            {
                                if (x < minX) minX = x;
                                if (x > maxX) maxX = x;

                                if (y < minY) minY = y;
                                if (y > maxY) maxY = y;
                            }
                        }

                    totXSizeMax += maxX - minX;
                }
            }

            FileInfo fi = new FileInfo(fileTargetName);
            FileStream fstr = fi.Create();
            Bitmap finalBitmap = new Bitmap(totXSizeMax, maxY - minY);
            fstr.Close();
            fi.Delete();

            using (var sw = new StreamWriter(fileTargetNameMap))
            {
                int xCustomAcc = 0;

                foreach (var currentFrame in myFilesList)
                {
                    if (currentFrame.FullName.EndsWith(".txt"))
                        continue;
                    if (currentFrame.FullName.Contains("min."))
                        continue;

                    Console.WriteLine(" currentFrame => " + currentFrame.FullName);

                    var sampleItem = new Bitmap(currentFrame.FullName);

                    using (Graphics grD = Graphics.FromImage(finalBitmap))
                    {
                        int minX = 99999, maxX = 0;

                        for (int y = 0; y < totHeight; y++)
                            for (int x = 0; x < widthPadrao; ++x)
                            {
                                Color utd = sampleItem.GetPixel(x, y);

                                if (utd.A > 0)
                                {
                                    if (x < minX) minX = x;
                                    if (x > maxX) maxX = x;
                                }
                            }

                        int curSafeWidth = maxX - minX;

                        Rectangle destRegion = new Rectangle(xCustomAcc, 0, curSafeWidth, maxY - minY);
                        Rectangle srcRegion = new Rectangle(minX, minY, curSafeWidth, maxY - minY);

                        sw.WriteLine(destRegion.X + "," + destRegion.Y + "," + destRegion.Width + "," + destRegion.Height + "," + minX + "," + minY);

                        grD.DrawImage(sampleItem, destRegion, srcRegion, GraphicsUnit.Pixel);

                        xCustomAcc += curSafeWidth;
                    }
                }
            }

            finalBitmap.Save("test.png", ImageFormat.Png);
            File.Move("test.png", fileTargetName);

            Console.WriteLine(" >> Salvo com sucesso! ");
            Console.WriteLine();
        }

        static void Proc (string destino, string prefix )
        {
            string BaseApp = "CrossPlat";
            string currentDir = Directory.GetCurrentDirectory() + "\\" + BaseApp + "\\Content\\Images\\";
            currentDir = currentDir.Replace("ImageProc\\bin\\Release\\", "");
            string dir = currentDir + destino;                    

            Console.WriteLine(dir);

            if (!Directory.Exists (dir))
            {
                Console.WriteLine("Diretório não existe");
                return;
            }

            var sample = new Bitmap(dir + "\\" + prefix + (new DirectoryInfo(dir).GetFiles().Length < 100 ? "01.png" : "0001.png"));

            string  fileTargetName = dir + "\\" + prefix + "_min.png",
                    fileTargetNameMap = dir + "\\" + prefix + "_min.txt";

            Console.WriteLine(" >> target mini => " + fileTargetName);

            if (File.Exists(fileTargetName)) File.Delete(fileTargetName);
            if (File.Exists(fileTargetNameMap)) File.Delete(fileTargetNameMap);

            int totFrames = new DirectoryInfo(dir).GetFiles().Length,
                widthPadrao = sample.Width,
                totHeight = sample.Height;

            Console.WriteLine(" widthPadrao => " + widthPadrao);
            Console.WriteLine(" totFrames => " + totFrames);
            Console.WriteLine(" totHeight => " + totHeight);

            FileInfo fi = new FileInfo(fileTargetName);
            FileStream fstr = fi.Create();
            Bitmap finalBitmap = new Bitmap(widthPadrao * totFrames, totHeight);
            fstr.Close();
            fi.Delete();

            using (var sw = new StreamWriter(fileTargetNameMap))
            {
                for (int i = 1; i <= totFrames; i++)
                {
                    var currentFrame = dir + "\\" + prefix + (totFrames < 100 ? i.ToString("00") : i.ToString("000")) + ".png";

                    Console.WriteLine(" currentFrame => " + currentFrame);

                    var sampleItem = new Bitmap(currentFrame);
                    
                    using (Graphics grD = Graphics.FromImage(finalBitmap))
                    {
                        int minX = 99999, maxX = 0;

                        for (int y = 0; y < totHeight; y++)
                            for (int x = 0; x < widthPadrao; ++x)
                            {
                                Color utd = sampleItem.GetPixel(x, y);

                                if (utd.A > 0)
                                {
                                    if (x < minX) minX = x;
                                    if (x > maxX) maxX = x;
                                }
                            }

                        Rectangle destRegion = new Rectangle((i - 1) * widthPadrao, 0, widthPadrao, totHeight);
                        Rectangle srcRegion = new Rectangle(0, 0, widthPadrao, totHeight);

                        sw.Write(destRegion.X.ToString()); sw.Write(",");
                        sw.Write(destRegion.Y.ToString()); sw.Write(",");
                        sw.Write(destRegion.Width.ToString()); sw.Write(",");
                        sw.Write(destRegion.Height.ToString()); sw.Write(";");
                        sw.Write("0"); sw.Write(",");
                        sw.Write("0"); sw.Write(";");

                        grD.DrawImage(sampleItem, destRegion, srcRegion, GraphicsUnit.Pixel);
                    }
                }
            }

            finalBitmap.Save("test.png", ImageFormat.Png);
            File.Move("test.png", fileTargetName);

            Console.WriteLine(" >> Salvo com sucesso! ");
            Console.WriteLine();
        }
    }
}
