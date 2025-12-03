// app/page.jsx  or  any component
import Navbar from "../components/navbar";
import TimeLineVis from "./timeline";
import { getVisManager } from "@/lib/getVisManager";
export default function Vis() {
  const visMan = getVisManager();
  return (
    <div>
      <h1>RIVER</h1>
      <h1>RIVER</h1>
      <h1>RIVER</h1>
      <Navbar />
      <TimeLineVis visMan={visMan}/>
    </div>
  );
}
