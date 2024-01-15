import cx from "clsx";
import classes from "~/styles/footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={cx(classes.footer, "mt-14 py-4 text-center")}>
      <p className="text-sm font-medium">
        &copy; {year} -{" "}
        <a
          href="https://github.com/jaular"
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jos&eacute; Aular
        </a>
      </p>
    </footer>
  );
};

export default Footer;
