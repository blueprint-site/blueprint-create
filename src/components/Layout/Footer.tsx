import Logo from "@/assets/logo.webp";
import ThemeToggle from "@/components/ThemeToggle";

const BottomBar = () => {
  return (
    <footer className="w-full bg-container dark:bg-container-dark">
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          {/* Logo and Title Row */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Blueprint Site Logo" className="w-8" />
              <h4 className="font-bold text-lg">
                Blueprint Site
              </h4>
            </div>

            <h6 className="text-xs font-normal">
              Found a bug? Report it to{" "}
              <a
                href="https://github.com/blueprint-site/blueprint-site.github.io"
                className="hover:underline"
              >
                GitHub issues
              </a>
              .
            </h6>
          </div>
          <div className="flex-1">
            {/* Links to site pages */}
            <div className="flex justify-center gap-4">
              <a href="/addons" className="text-xs font-normal hover:underline">
                Addons
              </a>
              <a href="/schematics" className="text-xs font-normal hover:underline">
                Schematics
              </a>
              <a
                href="https://blueprint-site.github.io/blueprint-blog/"
                className="text-xs font-normal hover:underline"
              >
                Blog
              </a>
              <a href="/about" className="text-xs font-normal hover:underline">
                About
              </a>
            </div>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs font-normal text-foreground text-center mt-4">
          <div>
            NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED
            WITH MOJANG OR MICROSOFT.
          </div>
          <div>
            Not affiliated with Create Mod team or one of the addons in any way.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;
