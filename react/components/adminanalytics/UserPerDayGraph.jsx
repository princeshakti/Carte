import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import googleAnalytics from '../../services/googleAnalyticsService';
import CardTitle from './CardTitle';
import toastr from 'toastr';

const _logger = debug.extend('UsersPerDay');

const UsersPerDayGraph = (props) => {
    const formData = { ...props.formData };

    let today = new Date().toISOString().slice(0, 10);

    const date = new Date();

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
    }

    let firstDayCurrentMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth()).toISOString().slice(0, 10);

    const [currentInfo] = useState({
        dateRanges: [
            {
                startDate: firstDayCurrentMonth,
                endDate: today,
            },
        ],
        metrics: 'ga:users',
        dimensions: 'ga:day',
        order: [{ FieldName: 'ga:day', sortOrder: 'ASCENDING' }],
    });

    const [analyticsData, setAnalyticsData] = useState([]);
    _logger(analyticsData);

    const [dimensions, setDimensions] = useState([]);
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const payload = { ...formData };
        _logger('Users/Day component payload', payload);
        if (props.isDates === true) {
            payload.metrics = 'ga:users';
            payload.dimensions = 'ga:day';
            payload.order = [];
            payload.order.push({
                FieldName: 'ga:day',
                sortOrder: 'ASCENDING',
            });
            payload.dateRanges = [];
            payload.dateRanges.push({
                startDate: props.initialDates.startDate,
                endDate: props.initialDates.endDate,
            });
            googleAnalytics.createAnalytics(payload).then(onGetUsersPerDaySuccess).catch(onGetUsersPerDayErr);
        } else {
            googleAnalytics.createAnalytics(currentInfo).then(onGetUsersPerDaySuccess).catch(onGetUsersPerDayErr);
        }
    }, [props.isDates]);

    const onGetUsersPerDayErr = (err) => {
        _logger('get users/day data err', err);
        toastr.error('Oops, something went wrong when fetching users data.');
    };

    const onGetUsersPerDaySuccess = (response) => {
        _logger('get users/day data success', response.item.reports);
        const reports = response.item.reports;
        setAnalyticsData((prevState) => {
            const ps = { ...prevState };
            ps.analyticsData = reports.map(mappedData);
            return ps;
        });
    };

    const mappedData = (analytics) => {
        _logger('Users/Day mappedData', analytics.data.rows);
        const rows = analytics.data.rows;
        setDimensions(rows.map((d) => d.dimensions));
        setMetrics(rows.map((m) => parseInt(m.metrics[0].values)));
    };

    const apexAreaChart1Opts = {
        chart: {
            height: 380,
            type: 'area',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 3,
            curve: 'smooth',
        },
        colors: ['#29b5c2', '#6c757d'],
        legend: {
            offsetY: -10,
        },
        xaxis: {
            categories: dimensions,
        },
        tooltip: {
            fixed: {
                enabled: false,
                position: 'topRight',
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
    };

    const apexAreaChart1Data = [
        {
            name: 'Users',
            data: metrics,
        },
    ];
    return (
        <>
            <Card>
                <Card.Body>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title={` Users Per Day`}
                        menuItems={[{ label: 'Refresh Report' }, { label: 'Export Report' }]}
                    />
                    <Chart
                        options={apexAreaChart1Opts}
                        series={apexAreaChart1Data}
                        type="area"
                        className="apex-charts"
                        height="405px"
                    />
                </Card.Body>
            </Card>
        </>
    );
};

UsersPerDayGraph.propTypes = {
    formData: PropTypes.shape({
        metrics: PropTypes.string.isRequired,
        dimensions: PropTypes.string.isRequired,
    }),
    isDates: PropTypes.bool.isRequired,
    initialDates: PropTypes.shape({
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
    }),
};

export default UsersPerDayGraph;
