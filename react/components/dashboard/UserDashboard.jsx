import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import OrderHistory from './OrderHistory';
import PopularPlaces from './PopularPlaces';
import RecentlyViewedMenus from './RecentlyViewedMenus';
import CardTitle from '../admindashboard/CardTitle';
import userService from '../../services/userService';
import userProfileService from '../../services/userProfileService';
import debug from 'sabio-debug';
import '../../assets/scss/icons.scss';
import Reviews from './Reviews';
import { Link } from 'react-router-dom';
import Favorites from './Favorites';
import Wallet from './Wallet';

const _logger = debug.extend('UserDashboard');

const UserDashboard = () => {
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        avatarUrl: '',
        id: '',
        location: {
            city: '',
            state: {
                name: '',
            },
        },
    });

    useEffect(() => {
        userService.currentUser().then(onGetCurrentUserSuccess).catch(onGetCurrentUserErr);
    }, []);

    const onGetCurrentUserErr = (err) => {
        _logger('Current User Err ->', err);
    };

    const onGetCurrentUserSuccess = (response) => {
        _logger('dup', response);

        userProfileService.GetByUserId(response.item.id).then(onGetUserProfileSuccess).catch(onGetUserProfileErr);
    };

    const onGetUserProfileErr = (err) => {
        _logger('User profile get err', err);
    };

    const onGetUserProfileSuccess = (response) => {
        _logger('user profile get success', response);
        setUserProfile((prevState) => {
            const ps = { ...prevState };
            ps.firstName = response.item.firstName;
            ps.lastName = response.item.lastName;
            ps.avatarUrl = response.item.avatarUrl;
            ps.id = response.item.id;
            return ps;
        });
    };

    const profilePic = userProfile?.avatarUrl || userProfile.avatarUrl;

    const [compId, setCompId] = useState();

    const showComp = (e) => {
        _logger(e.target.id);
        setCompId(e.target.id);
    };

    const renderComp = (compId) => {
        switch (compId) {
            case 'orders':
                return <OrderHistory />;
            case 'reviews':
                return <Reviews />;
            case 'favorites':
                return <Favorites />;
            case 'wallet':
                return <Wallet />;

            default:
                return <OrderHistory />;
        }
    };

    return (
        <>
            <Row>
                <Col>
                    <div className="page-title-box">
                        <div className="page-title-right"></div>
                        <h4 className="page-title">My Dashboard</h4>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xxl={3} lg={6} className="order-lg-1 order-xxl-1">
                    <Card>
                        <Card.Body>
                            <CardTitle
                                containerClass="d-flex align-items-center justify-content-between"
                                title={
                                    <>
                                        <img
                                            className="d-flex align-self-start rounded me-2"
                                            src={profilePic}
                                            alt=""
                                            height="48"
                                        />

                                        <div className="w-100 overflow-hidden">
                                            <h5 className="mt-1 mb-0">
                                                {' '}
                                                {userProfile?.firstName + ' ' + userProfile?.lastName}
                                            </h5>
                                            <p className="mb-1 mt-1 text-muted">
                                                {`${userProfile.location.city}, ${userProfile.location.state.name}`}
                                            </p>
                                        </div>
                                    </>
                                }
                                icon="mdi mdi-dots-horizontal"
                                menuItems={[{ label: 'Edit Profile' }, { label: 'Settings' }]}
                            />

                            <div className="list-group list-group-flush mt-2" onClick={showComp}>
                                <Link
                                    to="#"
                                    className="list-group-item list-group-item-action text-primary border-0"
                                    id="orders">
                                    <i className="uil uil-cart me-1"></i> Order History
                                </Link>

                                <Link to="#" className="list-group-item list-group-item-action border-0" id="reviews">
                                    <i className="uil uil-cart me-1"></i> Reviews
                                </Link>
                                <Link to="#" className="list-group-item list-group-item-action border-0" id="favorites">
                                    <i className="uil uil-favorite me-1"></i> Favorites
                                </Link>
                                <Link to="#" className="list-group-item list-group-item-action border-0" id="wallet">
                                    <i className="uil uil-wallet me-1"></i> Wallet
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <RecentlyViewedMenus />
                    <PopularPlaces />
                </Col>
                <Col xxl={8} lg={12} className="order-lg-2 order-xxl-1">
                    {renderComp(compId)}
                </Col>
            </Row>
        </>
    );
};

export default UserDashboard;
