import Layout from '../components/layout';

// Styles
import '../styles/bootstrap.min.css';
import '../styles/font-awesome.min.css';
import '../styles/themify-icons.css';
import '../styles/animate.css';
import '../styles/hamburgers.min.css';
import '../styles/slick.css';
import '../styles/util.css';
import '../styles/main.css';
 
export default function MyApp({ Component }) {
  return (
    <Layout>
      <Component />
    </Layout>
  )
}