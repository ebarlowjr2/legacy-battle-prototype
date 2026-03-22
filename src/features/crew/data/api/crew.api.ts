import { CrewRepo } from '../../api/repo';
import { CrewService } from '../../api/crew';

export const getCrewMembers = CrewRepo.getCrewMembers;
export const getPendingReceived = CrewRepo.getPendingReceived;
export const getBattleSuggestions = CrewRepo.getBattleSuggestions;
export const searchUsers = CrewRepo.searchUsers;
export const getRequestStatus = CrewRepo.getRequestStatus;
export { CrewService };
