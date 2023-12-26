import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Button, Loader } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import cx from "clsx";
import classes from "~/styles/header.module.css";

const Header = () => {
  return (
    <header className={cx(classes.header, "mb-14")}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 py-4 text-center sm:px-6 lg:px-8">
        <Link href="/">
          <span>Logo</span>
        </Link>
        <div>
          <AuthShowcase />
        </div>
      </div>
    </header>
  );
};

function AuthShowcase() {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-700"></div>
    );
  }

  if (status === "authenticated") {
    return (
      <Menu trigger="hover" shadow="md" width={200}>
        <Menu.Target>
          {/* <Button variant="default" size="xs">
            <span className="text-sm font-normal">
              {sessionData.user?.name} ({sessionData.user?.role})
            </span>
          </Button> */}
          {sessionData.user.image ? (
            <Image
              className="rounded-full bg-gray-700"
              src={sessionData.user?.image}
              title={sessionData.user?.name || ""}
              width={32}
              height={32}
              alt="user"
            />
          ) : (
            <IconUser
              className="rounded-full bg-gray-700"
              width={32}
              height={32}
            />
          )}
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>-- {sessionData.user?.role.toUpperCase()} --</Menu.Label>
          <Menu.Label>{sessionData.user?.email}</Menu.Label>
          <Menu.Divider />
          <Menu.Item component={Link} href="/">
            Equipos
          </Menu.Item>
          <Menu.Item component={Link} href="/accs">
            Accesorios
          </Menu.Item>
          {sessionData?.user.role === "admin" && (
            <Menu.Item component={Link} href="/users">
              Gesti&oacute;n de usuarios
            </Menu.Item>
          )}
          <Menu.Divider />
          <Menu.Item onClick={() => void signOut()}>
            Cerrar sesi&oacute;n
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Button variant="default" onClick={() => void signIn()}>
      Iniciar sesión
    </Button>
  );
}

export default Header;
