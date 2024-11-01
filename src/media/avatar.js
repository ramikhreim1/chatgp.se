import avatar from "./blank.png"
const Avatar = (props) => {
    return (
        <img src={avatar} alt="" {...props}/>
    )
}
export default Avatar