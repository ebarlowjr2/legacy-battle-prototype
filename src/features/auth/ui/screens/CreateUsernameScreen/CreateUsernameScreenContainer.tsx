import type { CreateUsernameScreenProps } from '@/shared/types';
import { useCreateUsername } from '../../hooks/useCreateUsername';
import { CreateUsernameScreen } from './CreateUsernameScreen';

export default function CreateUsernameScreenContainer(props: CreateUsernameScreenProps) {
  const createUsername = useCreateUsername();
  return <CreateUsernameScreen {...props} {...createUsername} />;
}
