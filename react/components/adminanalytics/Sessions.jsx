import React, { useEffect, useState } from 'react';
import debug from 'sabio-debug';
import googleAnalytics from '../../services/googleAnalyticsService';
import { Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import CardTitle from './CardTitle';
import PropTypes from 'prop-types';
import './admindash.css';
import toastr from 'toastr';

const _logger = debug.extend('Sessions');
function Sessions(props) {
    const formData = { ...props.formData };
    const today = new Date().toISOString().slice(0, 10);
    const date = new Date();

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
    }

    const firstDayCurrentMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth()).toISOString().slice(0, 10);

    const [totalSessions] = useState({
        dateRanges: [
            {
                startDate: '2022-09-15',
                endDate: today,
            },
        ],
        metrics: 'ga:sessions',
        dimensions: 'ga:sessionDurationBucket',
        order: [{ FieldName: 'ga:sessions', sortOrder: 'DESCENDING' }],
    });

    const [sessionDuration] = useState({
        dateRanges: [
            {
                startDate: '2022-09-15',
                endDate: today,
            },
        ],
        metrics: 'ga:sessionDuration',
        dimensions: 'ga:Year',
        order: [{ FieldName: 'ga:Year', sortOrder: 'DESCENDING' }],
    });

    const [sessionsPerUser] = useState({
        dateRanges: [
            {
                startDate: firstDayCurrentMonth,
                endDate: today,
            },
        ],
        metrics: 'ga:sessionsPerUser',
        dimensions: 'ga:day',
        order: [{ FieldName: 'ga:day', sortOrder: 'ASCENDING' }],
    });

    const [analyticsData, setAnalyticsData] = useState({
        arrayOfTotalSessions: [],
        arrayOfSessionDuration: [],
        arrayOfSessionsPerUser: [],
    });

    const [durationValue, setDurationValue] = useState([]);
    const [dimensions, setDimensions] = useState([]);
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const payload = { ...formData };
        _logger('Sessions component payload', payload);
        if (props.isDates === true) {
            payload.metrics = 'ga:sessionsPerUser';
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
            googleAnalytics.createAnalytics(payload).then(onGetSessionsPerUserSuccess).catch(onGetSessionsPerUserErr);
        } else {
            googleAnalytics.createAnalytics(totalSessions).then(onGetTotalSessionsSuccess).catch(onGetTotalSessionsErr);
            googleAnalytics.createAnalytics(sessionDuration).then(onGetDurationSuccess).catch(onGetDurationErr);
            googleAnalytics
                .createAnalytics(sessionsPerUser)
                .then(onGetSessionsPerUserSuccess)
                .catch(onGetSessionsPerUserErr);
        }
    }, [props.isDates]);

    const onGetTotalSessionsErr = (err) => {
        _logger('get sessions data err', err);
        toastr.error('Oops, something went wrong when fetching total sessions data.');
    };

    const onGetTotalSessionsSuccess = (response) => {
        _logger('get sessions data success', response.item.reports);
        const analytics = response.item.reports;
        setAnalyticsData((prevState) => {
            const ps = { ...prevState };
            ps.arrayOfTotalSessions = analytics.map(mappedTotalSessions);
            return ps;
        });
    };

    const mappedTotalSessions = (analytics) => {
        _logger('Sessions mappedSessions', analytics.data.rowCount);
        const rowCount = analytics.data.rowCount;
        return rowCount;
    };

    const onGetDurationErr = (err) => {
        _logger('duration err', err);
    };

    const onGetDurationSuccess = (response) => {
        const reports = response.item.reports;
        setAnalyticsData((prevState) => {
            const ps = { ...prevState };
            ps.arrayOfSessionDuration = reports.map(mappedSessionDuration);
            return ps;
        });
    };

    const mappedSessionDuration = (duration) => {
        const rows = duration.data.rows;
        setDurationValue(rows.map((m) => parseInt(m.metrics[0].values)));
    };

    const onGetSessionsPerUserErr = (err) => {
        _logger('dates err', err);
    };

    const onGetSessionsPerUserSuccess = (response) => {
        _logger('duration success', response.item.reports);
        const reports = response.item.reports;
        setAnalyticsData((prevState) => {
            const ps = { ...prevState };
            ps.arrayOfSessionsPerUser = reports.map(mappedSessionsPerUser);
            return ps;
        });
    };

    const mappedSessionsPerUser = (dates) => {
        const rows = dates.data.rows;
        setDimensions(rows.map((d) => d.dimensions));
        setMetrics(rows.map((m) => parseInt(m.metrics[0].values)));
    };

    const avgSessionDuration = durationValue / analyticsData.arrayOfTotalSessions;

    function convertHMS(value) {
        const sec = parseInt(value, 10);
        let hours = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - hours * 3600) / 60);
        let seconds = sec - hours * 3600 - minutes * 60;

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }

    const avgTime = convertHMS(avgSessionDuration);

    const colors = ['#9f87f5'];

    const apexBarChartOpts = {
        grid: {
            padding: {
                left: 0,
                right: 0,
            },
        },
        chart: {
            type: 'area',
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 4,
        },
        zoom: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        colors: colors,
        xaxis: {
            type: 'string',
            categories: dimensions,
            tooltip: {
                enabled: false,
            },
            axisBorder: {
                show: false,
            },
            labels: {},
            title: {
                text: 'Date',
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val;
                },
                offsetX: -15,
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                type: 'vertical',
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.45,
                opacityTo: 0.1,
                stops: [45, 100],
            },
        },
    };

    const apexBarChartData = [
        {
            name: 'Sessions/User',
            data: metrics,
        },
    ];
    return (
        <>
            <Card>
                <Card.Body>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title="Lifetime Sessions"
                        menuItems={[{ label: 'Refresh Report' }, { label: 'Export Report' }]}
                    />

                    <div className="container text-center">
                        <h5>
                            Total Sessions: <p className="admin-dash-sessions">{analyticsData.arrayOfTotalSessions}</p>
                        </h5>
                        <h5>
                            Average Session Duration: <p className="admin-dash-sessions">{avgTime}</p>
                        </h5>
                    </div>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title={`Number of Sessions Per User`}
                        menuItems={[{ label: 'Refresh Report' }, { label: 'Export Report' }]}
                    />

                    <Chart
                        options={apexBarChartOpts}
                        series={apexBarChartData}
                        type="area"
                        className="apex-charts mt-3"
                        height={225}
                    />
                </Card.Body>
            </Card>
        </>
    );
}

Sessions.propTypes = {
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

export default Sessions;
