import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import CardTitle from '../admindashboard/CardTitle';

const RecentlyViewedMenus = () => {
    return (
        <>
            <Card>
                <Card.Body className="p-2">
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-1"
                        title="Recently Viewed Menus"
                        icon="mdi mdi-dots-horizontal"
                    />
                    <div className="list-group list-group-flush my-2">
                        <Link to="#" className="list-group-item list-group-item-action border-0">
                            <i className="uil uil-food me-1"></i>Blaze Pizza
                        </Link>
                        <Link to="#" className="list-group-item list-group-item-action border-0">
                            <i className="uil uil-building me-1"></i>The Cheesecake Factory
                        </Link>
                        <Link to="#" className="list-group-item list-group-item-action border-0">
                            <i className="uil uil-coffee me-1"></i>Starbucks
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default RecentlyViewedMenus;
