import cx from "clsx";
import classes from "~/styles/footer.module.css";

const Footer = () => {
  return (
    <footer className={cx(classes.footer, "mt-14 py-4 text-center")}>
      <p className="text-sm font-medium">Footer</p>
    </footer>
  );
};

export default Footer;
