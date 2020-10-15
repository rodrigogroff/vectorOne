using System.Collections.Generic;

namespace GameSystem
{
	public partial class Player : GameObject
	{
        public List<int> framesDx = new List<int>(),
						 framesDy = new List<int>();

        public void LoadContent(GameOptions go)
		{
			var lib = go.im;

			switch (shipSkin)
			{
				case PlayerSkin.White:
                    lstSpaceShipImg = lib.LoadImageMappedBinSequence("Players\\Blue\\cw_blue", 120, ref go.gdm, ref framesDx, ref framesDy);
					break;

                case PlayerSkin.Red:
                    lstSpaceShipImg = lib.LoadImageMappedBinSequence("Players\\Red\\cw_red", 120, ref go.gdm, ref framesDx, ref framesDy);
                    break;
			}

			lib.LoadImage("Players\\plasmaShotBlue.png", ref plasmaShotBlue, ref go.gdm);
			lib.LoadImage("Players\\plasmaShot.png", ref plasmaShot, ref go.gdm);
			lib.LoadImage("Players\\option.png", ref optionImage, ref go.gdm);
		}
	}
}
