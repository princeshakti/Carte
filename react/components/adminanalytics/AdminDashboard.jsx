import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import debug from 'sabio-debug';
import ViewsChart from './ViewsChart';
import { Form, Formik, Field } from 'formik';
import BrowsersChart from './BrowsersChart';
import Sessions from './Sessions';
import OperatingSystems from './OperatingSystems';
import UserPerDayGraph from './UserPerDayGraph';
import { Link } from 'react-router-dom';

const _logger = debug.extend('AdminDashboard');

const AdminDashboard = () => {
    const [formData] = useState({
        metrics: '',
        dimensions: '',
    });

    _logger('parent formData ->', formData);

    const [initialDates, setInitialDates] = useState({
        startDate: '',
        endDate: '',
    });

    const [isDates, setIsDates] = useState(false);

    useEffect(() => {
        if (initialDates.startDate !== null && initialDates.endDate !== null) {
            if (initialDates.startDate < initialDates.endDate) {
                setIsDates(!isDates);
            }
        }
    }, [initialDates]);

    const handleChange = (event) => {
        _logger('Form::onChange', event.target.value);
        if (event.target.name === 'startDate') {
            setInitialDates((prevState) => {
                const ps = { ...prevState, startDate: event.target.value };
                return ps;
            });
        }
        if (event.target.name === 'endDate') {
            setInitialDates((prevState) => {
                const ps = { ...prevState, endDate: event.target.value };
                return ps;
            });
        }
    };

    return (
        <>
            <Row>
                <Col>
                    <h4>Analytics Overview</h4>

                    <div className="d-flex justify-content-md-end text-center">
                        <Formik initialValues={initialDates} enableReinitialize={true}>
                            <Form onChange={handleChange}>
                                <Row>
                                    <Col xs="auto">
                                        <label className="form-label" name="startDate">
                                            Start Date
                                        </label>
                                        <Field type="date" name="startDate" className="form-control" />
                                    </Col>
                                    <Col xs="auto">
                                        <label className="form-label" name="endDate">
                                            End Date
                                        </label>
                                        <Field type="date" name="endDate" className="form-control" />
                                    </Col>
                                </Row>
                            </Form>
                        </Formik>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link className="btn btn-primary" to="/admin/newslettersubscription">
                        Newsletter Subscriptions
                    </Link>
                </Col>
            </Row>
            <br />
            <Row>
                <Col xl={3} lg={6}>
                    <Sessions formData={formData} initialDates={initialDates} isDates={isDates} />
                </Col>
                <Col xl={9} lg={10}>
                    <ViewsChart formData={formData} initialDates={initialDates} isDates={isDates} />
                    <br />
                </Col>
            </Row>
            <Row>
                <Col xl={3} lg={6}>
                    <OperatingSystems formData={formData} initialDates={initialDates} isDates={isDates} />
                </Col>

                <Col xl={3} lg={6}>
                    <BrowsersChart formData={formData} initialDates={initialDates} isDates={isDates} />
                </Col>

                <Col>
                    <UserPerDayGraph formData={formData} initialDates={initialDates} isDates={isDates} />
                </Col>
            </Row>
        </>
    );
};

export default AdminDashboard;
