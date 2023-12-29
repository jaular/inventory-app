import { useSession } from "next-auth/react";
import { Loader } from "@mantine/core";
import Container from "~/components/Container";
import Message from "~/components/Message";
import UserMain from "~/components/user/UserMain";

export default function UsersPage() {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <Container title="Gestión de usuarios">
        <div className="flex min-h-[65vh] items-center justify-center">
          <Loader color="blue" size="lg" />
        </div>
      </Container>
    );
  }

  if (status === "authenticated" && sessionData?.user.role === "admin") {
    return (
      <Container title="Gestión de usuarios">
        <UserMain />
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Container title="Gestión de usuarios">
        <Message title="Inicia sesión" />
      </Container>
    );
  }

  return (
    <Container title="Gestión de usuarios">
      <Message title="¡No estás autorizado a ver esta página!" />
    </Container>
  );
}
