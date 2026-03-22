import * as battlesApi from '../data/api/battles.api';

export const BattlesRepo = {
  getBattles: battlesApi.getBattles,
  getBattleWithParticipants: battlesApi.getBattleWithParticipants,
  getExploreBattles: battlesApi.getExploreBattles,
  getQuickPickBattles: battlesApi.getQuickPickBattles,
  getMyAcceptedBattles: battlesApi.getMyAcceptedBattles,
};
