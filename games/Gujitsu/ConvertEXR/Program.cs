using System.Diagnostics;
using System.IO;

namespace ConvertEXR
{
    class Program
    {
        static void Main(string[] args)
        {
            var d = Directory.GetCurrentDirectory();

            foreach (var item in Directory.GetFiles(d))
            {
                if (item.EndsWith(".exr"))
                {
                    var anyCommand = "ffmpeg -y -i \"" + item + "\" -pix_fmt rgb32 \"" + item.Replace(".exr", ".png") + "\"";

                    Process.Start(new ProcessStartInfo
                    {
                        UseShellExecute = true,
                        WorkingDirectory = d,
                        FileName = @"C:\Windows\System32\cmd.exe",
                        Verb = "runas",
                        Arguments = "/c " + anyCommand,                        
                        WindowStyle = ProcessWindowStyle.Hidden
                    });
                }
            }
        }
    }
}
