import { useSession } from "next-auth/react";
import { Loader } from "@mantine/core";
import Container from "~/components/Container";
import Message from "~/components/Message";
import AccMain from "~/components/acc/AccMain";

export default function AccPage() {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <Container title="Inventario de accesorios">
        <div className="flex min-h-[65vh] items-center justify-center">
          <Loader color="blue" size="lg" />
        </div>
      </Container>
    );
  }

  if (status === "authenticated" && sessionData?.user.role !== "none") {
    return (
      <Container title="Inventario de accesorios">
        <AccMain user={sessionData.user} />
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Container title="Inventario de accesorios">
        <Message title="Inicia sesión" />
      </Container>
    );
  }

  return (
    <Container title="Inventario de accesorios">
      <Message title="¡No estás autorizado a ver esta página!" />
    </Container>
  );
}
