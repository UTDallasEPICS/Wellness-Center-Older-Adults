"use client";
import "app/styles/dashboard.css";
import SimpleTab, {Tab} from "app/components/SimpleTab.jsx";

const tabs =[
  {aKey: "added", title: "Added", content:"Hi"},
  {aKey: "reserved", title: "Reserved", content:"Reserved"},
  {aKey: "completed", title: "Completed", content:"Bye"},
]


const Dashboard = () => {


  return(
    
    
      <SimpleTab activeKey="added">
        {tabs.map(item => <Tab key={item.aKey} aKey={item.aKey} title={item.title}>{item.content}</Tab>)}
      </SimpleTab>
    

  );
}

export default Dashboard;