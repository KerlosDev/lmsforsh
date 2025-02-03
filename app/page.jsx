
import Image from "next/image";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Content from "./components/Content";
import Courses from "./components/Courses";
import GlobalApi from "./api/GlobalApi";





export default function Home() {


  return (


    <div className=" font-arabicUI">

      
      <Hero></Hero>

 
      
      <Courses></Courses> 
    </div>
  );
}
