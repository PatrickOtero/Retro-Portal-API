import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../prisma/prisma';
import { nameNormalizer } from '../../utils/nameNormalizer';

export const getSavedGamesFromLocalDb= {
  async searchGame(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
  
  const gameName = nameNormalizer(id)

  console.log("\n Como o nome chegou: " + id + "\n" + "nome normalizado para busca " + gameName)

    if (!gameName) {
      return res.status(400).send({ error: 'A name for the game is needed' });
    }

    try {

      const game = await prisma.game.findFirst({
        where: {
          gameName
        }
      });

      if (!game) {
        return res.status(404).send({ message: "Game not found"});
      }

      return res.status(200).send({ game, localDB: true });
    } catch (error: any) {
      console.error('Erro ao buscar o jogo no banco de dados:', error.response?.data || error.message);

      return res.status(500).send({
        error: 'Internal server error',
        details: error.response?.data || error.message,
      });
    }
  },
};