import {createBrowserRouter, RouterProvider} from "react-router-dom";
import BioSamplesListing from "../pages/biosamplesListing/BioSamplesListing.tsx";
import BioSample from "../pages/bioSample/BioSample.tsx";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <BioSamplesListing/>
        },
        {
            path: '/:BioSample_Id',
            element: <BioSample/>
        }

    ])

    return <RouterProvider router={router}/>

}

export default Router;