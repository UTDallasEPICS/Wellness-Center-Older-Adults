{/*https://www.youtube.com/watch?v=VLQ0otNkS5Q&t=136s */}
import {useState} from "react";
import "app/styles/simpleTab.css"

const SimpleTab = ({activeKey, children}) =>{
  const [key, setkey] = useState(activeKey)
 
  
  
  return(
    
    <div className="tab-container">
    
      <div className="tabs">
        {children.map(item=>{
          return(
            <div key={item.props.aKey} className={key === item.props.aKey ? "tab-item active" : "tab-item"}
              onClick={()=>setkey(item.props.aKey)}>
                {item.props.title}
            </div>
          )
        })}
      </div>
      <div className="tab-content"> {/*Change later to include actual components */}
        {children.map(item=>{
          return (
            <div key={item.props.aKey} className = {key === item.props.aKey ? "tab-pane active" : "tab-pane"}>
            <div>{item.props.children}</div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export const Tab = () => {
  
  return(<></>)
  
}



export default SimpleTab;