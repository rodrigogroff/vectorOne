
namespace GameSystem
{
	public partial class Player : GameObject
	{
		public override void Terminate()
		{
			lstPlasmaFire.RemoveAll(y => y.NeedsTermination);
			lstOption.RemoveAll(y => y.NeedsTermination);
		}

		public bool Between (int x, int a, int b)
        {
			return x >= a && x < b;
        }

		public override void Update()
		{
			base.Update();

			ProcessFire();
			ProcInput();

			int fim_repeat_x = 20;

			int ini_subindo = 20, 
				ini_subindo_repeat = 50, 
				fim_subindo_repeat = 70;

			int ini_descendo = 70,
				ini_descendo_repeat = 100,
				fim_descendo_repeat = 120;

			if (IsUp)
			{
				if (curFrame < fim_repeat_x)
				{
					curFrame = ini_subindo;
				}
				else if (curFrame > ini_descendo && curFrame < fim_descendo_repeat)
				{
					// zerar repeat
					if (curFrame > ini_descendo_repeat)
						curFrame = ini_descendo_repeat;

					curFrame--;

					if (curFrame == ini_descendo)
						curFrame = ini_subindo;
				}
				else
				{
					++curFrame;

					if (curFrame >= fim_subindo_repeat)
						curFrame = ini_subindo_repeat;
				}
			}
			else if (IsDown)
			{
				if (curFrame < fim_repeat_x)
                {
					curFrame = ini_descendo;
				}
				else if (curFrame > ini_subindo && curFrame < fim_subindo_repeat)
				{
					// zerar repeat
					if (curFrame > ini_subindo_repeat)
						curFrame = ini_subindo_repeat;

					curFrame--;

					if (curFrame == ini_subindo)
						curFrame = ini_descendo;
				}
				else
				{
					++curFrame;

					if (curFrame >= fim_descendo_repeat)
						curFrame = ini_descendo_repeat;
				}
			}
			else // repeat 
			{				
				if (curFrame > ini_descendo)
                {
					// zerar repeat
					if (curFrame > ini_descendo_repeat)
						curFrame = ini_descendo_repeat;

					curFrame--;

					if (curFrame == ini_descendo)
						curFrame = 0;
				}
				else if (curFrame > ini_subindo)
                {
					// zerar repeat
					if (curFrame > ini_subindo_repeat)
						curFrame = ini_subindo_repeat;

					curFrame--;

					if (curFrame == ini_subindo)
						curFrame = 0;
				}
				else
				{
					++curFrame;
					if (curFrame == ini_subindo) curFrame = 0;
				}
			}

			lstPlasmaFire.ForEach(y => y.Update());
			lstOption.ForEach(y => y.Update());
		}
	}
}
