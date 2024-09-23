export default function Home() {
  return (
    <main>
      <div className="flex flex-row w-full bg-roboHotPink justify-between items-center px-4 py-1">
        <h1 className="text-4xl font-semibold">RoboKnights</h1>
        <div className="flex flex-row space-x-4">
          <NavbarItem title={"Home"}/>
          <NavbarItem title={"About"}/>
          <NavbarItem title={"Our Team"}/>
          <NavbarItem title={"Software"}/>
          <NavbarItem title={"Hardware"}/>
          <NavbarItem title={"Contact Us"}/>
        </div>
      </div>
    </main>
  );
}

function NavbarItem(props: {title: string}) {
  return (
    <p className="text-xl px-2 py-2 inline float-right">{props.title}</p>
  )
}
