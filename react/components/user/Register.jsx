import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import AccountLayout from './AccountLayout';
import userService from '../../services/userService';
import debug from 'sabio-debug';
import Swal from 'sweetalert2';
import './user.css';
import { BiUser } from 'react-icons/bi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import BottomLink from './BottomLink';
import registerSchema from '../../schemas/registerSchema';
import ReactGa from 'react-ga4';

const _logger = debug.extend('Register');

const Register = () => {
    const [payload] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        isRestaurantOrg: false,
    });
    const [inviteInfo, setCurrentInvite] = useState({
        firstname: '',
        middleInitial: '',
        mastname: '',
        email: '',
        inviteTypeId: '',
        orgId: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const nav = useNavigate();
    const invite = useLocation();
    _logger('inviteInfo state ----> ', inviteInfo);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    useEffect(() => {
        if (invite.state === null) {
            _logger('No information');
        } else if (invite?.state.type === 'CONFIRMED_INVITE') {
            setCurrentInvite((prevState) => {
                _logger('invite', invite);
                const newEmployee = { ...prevState };
                newEmployee.firstname = invite.state.info.firstname;
                newEmployee.middleInitial = invite.state.info.middleInitial;
                newEmployee.lastname = invite.state.info.lastname;
                newEmployee.email = invite.state.info.email;
                newEmployee.inviteTypeId = invite.state.info.inviteTypeId;
                newEmployee.orgId = invite.state.info.orgId;
                return newEmployee;
            });
            payload.email = invite.state.info.email;
            payload.inviteTypeId = invite.state.info.inviteTypeId;
        }
    }, []);

    const onSignUp = (values) => {
        _logger(values);

        userService.register(values).then(onRegisterSuccess).catch(onRegisterError);
        ReactGa.event({
            action: 'register_action',
            category: 'register_category',
            label: 'register_label',
            value: 'xxxxx',
        });
    };
    const onRegisterError = (err) => {
        _logger('Register User Error ->', err.response);
        if (err.response?.data.errors[0].includes('unique_Email')) {
            Swal.fire({
                title: 'Email Already Exists',
                text: 'Go to login page to sign in or reset password',
                icon: 'warning',
                button: 'Close',
            });
        } else {
            Swal.fire({
                title: 'Registration Failed!',
                text: 'Check if all fields are correct',
                icon: 'error',
                button: 'Close',
            });
        }
    };

    const onRegisterSuccess = (response) => {
        debugger;
        _logger('Register Success ->', response);
        let newUserId = response.item;
        if (!payload.inviteTypeId) {
            Swal.fire({
                title: 'Registered New User!',
                text: 'Please confirm email before logging in',
                icon: 'success',
                button: 'close',
            }).then(nav('/confirm'));
        } else {
            userService.addUserOrgs(newUserId, inviteInfo.orgId).then(onUserOrgSuccess).catch(onUserOrgError);
            Swal.fire({
                title: 'Registered New User!',
                text: 'Please confirm email before logging in',
                icon: 'success',
                button: 'close',
            }).then(nav('/confirm'));
        }
    };

    const onUserOrgSuccess = (response) => {
        Toast.fire({
            icon: 'success',
            title: 'User added to the organization!',
        });
        _logger('UserOrg success', response);
    };

    const onUserOrgError = (error) => {
        Toast.fire({
            icon: 'error',
            title: 'There was a problem adding this user.',
        });
        _logger('UserOrg Error ->', error);
    };

    const onPasswordEyeClicked = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AccountLayout bottomLinks={<BottomLink />}>
            <>
                <h4 className="mt-0">{'Welcome to Carte'}</h4>
                <p className="text-muted mb-4">
                    {"Don't have an account? Create one below, it takes less than a minute."}
                </p>

                <Formik
                    enableReinitialize={true}
                    initialValues={payload}
                    onSubmit={onSignUp}
                    validationSchema={registerSchema}>
                    {({ values }) => (
                        <Form>
                            <div className="mb-3">
                                <label className="form-label" name="email">
                                    Email Address
                                </label>
                                <Field
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                />
                                <ErrorMessage name="email" component="div" className="has-error" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="d-flex">
                                    <Field
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <div
                                        className="show-password input-group-text input-group-password"
                                        data-password={showPassword ? 'true' : 'false'}>
                                        {!showPassword ? (
                                            <BsEye onClick={onPasswordEyeClicked} />
                                        ) : (
                                            <BsEyeSlash onClick={onPasswordEyeClicked} />
                                        )}
                                    </div>
                                </div>
                                <ErrorMessage name="password" component="div" className="has-error" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <div className="d-flex">
                                    <Field
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <div
                                        className="show-password input-group-text input-group-password"
                                        data-password={showPassword ? 'true' : 'false'}>
                                        {!showPassword ? (
                                            <BsEye onClick={onPasswordEyeClicked} />
                                        ) : (
                                            <BsEyeSlash onClick={onPasswordEyeClicked} />
                                        )}
                                    </div>
                                </div>
                                <ErrorMessage name="confirmPassword" component="div" className="has-error" />
                            </div>
                            <div className="d-flex m-1">
                                <Field type="checkbox" name="isRestaurantOrg" />
                                <label className="form-check-label m-1">
                                    {values.isRestaurantOrg}Check here if you are signing up as a restaurant
                                </label>
                            </div>
                            <ErrorMessage name="checked" component="div" className="has-error" />
                            <div className="mb-0 d-grid text-center">
                                <Button type="submit" className="user-btn">
                                    <BiUser className="m-1" />
                                    {'Sign Up'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        </AccountLayout>
    );
};

export default Register;
