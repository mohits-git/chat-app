import React from "react";
import { Outlet } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
      Home
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default Home
