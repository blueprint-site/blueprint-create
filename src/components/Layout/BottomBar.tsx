import Logo from "@/assets/logo.webp";

const BottomBar = () => {
  return (
    <footer className="w-full bg-container dark:bg-container-dark border-t border-border shadow-md mt-auto">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 py-5">
          {/* Logo and Title Row */}
          <div className="flex items-center gap-3">
            <img 
              src={Logo} 
              alt="Blueprint Site Logo" 
              className="w-8"
            />
            <h4 className="text-foreground font-bold font-sans text-base">
              Blueprint Site
            </h4>
          </div>
          
          {/* Legal Text */}
          <div className="flex flex-col gap-2">
            <h6 className="text-foreground text-xs font-normal">
              Found a bug? Report it to{' '}
              <a 
                href="https://github.com/blueprint-site/blueprint-site.github.io" 
                className="text-foreground hover:underline"
              >
                GitHub issues
              </a>
              .
            </h6>
            
            <h6 className="text-foreground text-xs font-normal">
              NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
            </h6>
            
            <h6 className="text-foreground text-xs font-normal">
              Not affiliated with Create Mod team or one of the addons in any way.
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;