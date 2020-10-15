﻿using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace GameSystem
{
	public partial class Player : GameObject
	{
		PlayerSelection myPlayer;
		PlayerSkin shipSkin;

		public Texture2D plasmaShot,
						 plasmaShotBlue,
						 optionImage;

		public List<Texture2D> lstSpaceShipImg;

		public List<GameObject> lstPlasmaFire = new List<GameObject>(),
								lstOption = new List<GameObject>();

		public int powerLevel = 1, // start power
			curFrame = 0,  // main image star index
			fireTimer = 1,  // counter 			
			accel = 1;

		bool IsAutoFire = false;

		public Player ( BaseWorld world, PlayerSelection _joy, PlayerSkin _shipSkin ) : base (world)
		{
			ObjectType = GameObjectType.Player;

			myPlayer = _joy;
			shipSkin = _shipSkin;

			colisionRect = new Rectangle(40, 48, 40, 10);

			LoadContent(world.go);
		}
	}
}
