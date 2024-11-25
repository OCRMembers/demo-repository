import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Home from "./pages/Home";


export default function App() {
	const router = createBrowserRouter([
		{
			path:'',
			element: <Home/>,
			children:[
				{
					path: 'Home',
					element: <Home/>
				},
			]
		}
	]);
	return (
		<RouterProvider router={router} />
	);

}
