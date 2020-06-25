﻿using System;
using System.IO;
using System.Diagnostics;

using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

using GameObjects;

namespace Gujitsu
{
	public class GameLooper : Game
	{
		GameOptions go = new GameOptions();

		GraphicsDeviceManager gdm;
		RenderTarget2D rTarget;
		BaseWorld gameWorld;
		Rectangle destRect;		
		SpriteBatch batch;
		
		public GameLooper()
		{
			gdm = new GraphicsDeviceManager(this);

			go.gdm = gdm;

			gdm.IsFullScreen = false;
			gdm.SynchronizeWithVerticalRetrace = true;			

			if (gdm.IsFullScreen)
			{
				gdm.PreferredBackBufferWidth = GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width;
				gdm.PreferredBackBufferHeight = GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height;
			}
			else
			{
				gdm.PreferredBackBufferWidth = go.virtualWidth;
				gdm.PreferredBackBufferHeight = go.virtualHeight;
			}

			gdm.ApplyChanges();
		}
		
		protected override void Initialize()
		{
			try
			{
				base.Initialize();

				var sf = GraphicsDevice.PresentationParameters.BackBufferFormat;

				batch = new SpriteBatch(GraphicsDevice);
				rTarget = new RenderTarget2D(GraphicsDevice, go.virtualWidth, go.virtualHeight, false, sf, DepthFormat.Depth24);
				destRect = new Rectangle(0, 0, gdm.PreferredBackBufferWidth, gdm.PreferredBackBufferHeight);
				
				gameWorld = new GameMap(Content,"w1.txt", true, go);
			}
			catch (Exception ex )
			{
				SaveException(ex);
			}
		}
				
		protected override void Update(GameTime gameTime)
		{
			try
			{
				if (gameWorld.ChangeScreen)
				{
					gameWorld.ChangeScreen = false;

					gdm.IsFullScreen = true;
					gdm.PreferredBackBufferWidth = GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width;
					gdm.PreferredBackBufferHeight = GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height;

					gdm.ApplyChanges();

					destRect = new Rectangle(0, 0, gdm.PreferredBackBufferWidth, gdm.PreferredBackBufferHeight);
				}

				if (gameWorld.ExitGame)
					Exit();

				gameWorld.UpdateCollisions();
				gameWorld.Terminate();
				gameWorld.Update();
			}
			catch (Exception ex)
			{
				SaveException(ex);
			}
		}
		
		protected override void Draw(GameTime gameTime)
		{
			try
			{
				// render to virtual console resolution
				GraphicsDevice.SetRenderTarget(rTarget);
				GraphicsDevice.Clear(Color.Black);
				batch.Begin(blendState: BlendState.NonPremultiplied);
				gameWorld.Draw(batch);
				batch.End();
				GraphicsDevice.SetRenderTarget(null);

				// render to full screen
				GraphicsDevice.Clear(Color.Black);
				batch.Begin();
				batch.Draw(rTarget, destRect, gameWorld.worldColor);
				batch.End();
			}
			catch (Exception ex)
			{
				SaveException(ex);
			}
		}

		public void SaveException (Exception ex)
		{
			var file = "log.txt";
			if (File.Exists(file)) File.Delete(file);
			using (var s = new StreamWriter(file, false, System.Text.Encoding.Unicode))
				s.Write(ex.ToString());
			Process.Start("notepad.exe", file);
			Exit();
		}
	}
}
