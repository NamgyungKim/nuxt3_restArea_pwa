import { useAuth } from '~/stores/auth';

export default function () {
  const auth = useAuth();
  const router = useRouter();
  if (!auth.auth) {
    router.push({ path: '/' });
  }
}
