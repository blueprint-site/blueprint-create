import ToolboxImage from '@/assets/toolbox/Red_Toolbox.webp';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import ToolBoxDrawer from '@/components/features/design/ToolBoxDrawer';
import { useThemeStore } from '@/api/stores/themeStore.ts';

const Toolbox = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className='absolute right-8 bottom-4 h-24 w-24'>
      <Drawer>
        <DrawerTrigger asChild>
          <img src={ToolboxImage} alt='Red Toolbox' className='h-full w-full cursor-pointer' />
        </DrawerTrigger>
        <DrawerContent className={isDarkMode ? 'bg-brass_casing' : 'bg-refined_radiance_casing'}>
          <DrawerHeader>
            <DrawerTitle className={'text-center'}>
              <div className={'text-foreground'}>Blueprint ToolBox</div>
            </DrawerTitle>
            <ToolBoxDrawer />
          </DrawerHeader>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Toolbox;
