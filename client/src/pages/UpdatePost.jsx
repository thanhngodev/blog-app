import 'react-circular-progressbar/dist/styles.css';
import { useParams } from 'react-router-dom';
import CreatePost from './CreatePost';

const UpdatePost = () => {
  const { postId } = useParams();
  return (
    <CreatePost postId={postId} />
  )
}

export default UpdatePost
