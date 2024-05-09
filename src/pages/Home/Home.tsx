import AddonsSlideshow from "../../components/AddonsSlideshow";
import AwardsBanner from "../../components/AwardsBanner";
import DiscoverAddonsText from "../../components/DiscoverAddonsText";
import HomeAddonList from "../../components/HomeAddonList";
function Home() {
  return (
    <>
      <AwardsBanner />
      <DiscoverAddonsText />
      <AddonsSlideshow />
      <HomeAddonList />
    </>
  );
}

export default Home;
