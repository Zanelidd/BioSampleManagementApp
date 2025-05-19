import {createBrowserRouter, RouterProvider} from "react-router-dom";
import BioSamplesListing from "../pages/biosamplesListing/BioSamplesListing.tsx";
import BioSample from "../pages/bioSample/BioSample.tsx";
import CreationSample from "../pages/creationSample/CreationSample.tsx";
import UpdateSample from "../pages/updateSample/UpdateSample.tsx";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <BioSamplesListing/>
        },
        {
            path: '/:BioSample_Id',
            element: <BioSample/>
        },
        {
            path: '/create',
            element: <CreationSample/>
        },
        {
            path: '/:BioSample_Id/update',
            element: <UpdateSample/>
        }

    ])

    return <RouterProvider router={router}/>

}

export default Router;