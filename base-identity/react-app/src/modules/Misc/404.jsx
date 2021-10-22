import React from 'react';
// import { NavLink } from 'react-router-dom';
// import Layout from 'components/MasterLayout';

const Error404 = () => (
    <div>
        {
            window.location.href = "/"
        }

    {
        /*
        <Layout>
            <div className="text-center">
                <img src="/assets/images/404.jpg" alt="not found" />
                <br /><br />
                <h1>Page Not Found :(</h1>
                <br /><br />
                <NavLink to="/" className="ant-btn ant-btn-primary">Home</NavLink>
            </div>  
        </Layout>          
        */
    }
    </div>
);

export default Error404;
