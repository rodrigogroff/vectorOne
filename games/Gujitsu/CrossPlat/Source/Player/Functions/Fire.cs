using Microsoft.Xna.Framework.Graphics;

namespace GameSystem
{
	public partial class Player : GameObject
	{
		public void ProcessFire()
		{
			if (IsAutoFire)
			{
				++fireTimer;

				if (fireTimer % 5 == 0 && fireTimer <= 25)
					PlayerFire(); 

				if (fireTimer > 45)
				{
					fireTimer = 0;
					IsAutoFire = false;
				}
			}
		}

		int XSpeed = 40, fireStartX = 190, fireStartY = 110;

		public void PlayerFire()
		{
			Texture2D shot = plasmaShot;

			if (myPlayer == PlayerSelection.PlayerTwo)
				shot = plasmaShotBlue;

			switch (powerLevel)
			{
				case 1: lstPlasmaFire.Add(new PlayerPlasma(MyWorld, MyGlobalPosition, fireStartX, fireStartY, XSpeed, 0, shot));
						break;

				case 2: lstPlasmaFire.Add(new PlayerPlasma(MyWorld, MyGlobalPosition, fireStartX, fireStartY - 8, XSpeed, 0, shot));
						lstPlasmaFire.Add(new PlayerPlasma(MyWorld, MyGlobalPosition, fireStartX, fireStartY + 8, XSpeed, 0, shot));
						break;

				case 3: lstPlasmaFire.Add(new PlayerPlasma(MyWorld, MyGlobalPosition, fireStartX, fireStartY - 12, XSpeed, -1.5F, shot));
						lstPlasmaFire.Add(new PlayerPlasma(MyWorld, MyGlobalPosition, fireStartX, fireStartY, XSpeed, 0, shot));
						lstPlasmaFire.Add(new PlayerPlasma(MyWorld, MyGlobalPosition, fireStartX, fireStartY + 12, XSpeed, 1.5F, shot));
						break;
			}

			foreach (var item in lstOption)
				lstPlasmaFire.Add(new PlayerPlasma(MyWorld, item.MyGlobalPosition, 0, 0, XSpeed, 0, shot));
		}
	}
}
