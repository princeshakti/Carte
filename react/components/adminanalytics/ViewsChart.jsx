import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import googleAnalytics from '../../services/googleAnalyticsService';
import Chart from 'react-apexcharts';
import { Card, Button, Collapse } from 'react-bootstrap';
import CardTitle from './CardTitle';
import toastr from 'toastr';

const _logger = debug.extend('ViewCharts');

const ViewsChart = (props) => {
    const formData = { ...props.formData };

    let today = new Date().toISOString().slice(0, 10);

    const date = new Date();

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
    }

    const firstDayCurrentMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth()).toISOString().slice(0, 10);

    const [currentInfo] = useState({
        dateRanges: [
            {
                startDate: firstDayCurrentMonth,
                endDate: today,
            },
        ],
        metrics: 'ga:pageviews',
        dimensions: 'ga:pagePath',
        order: [{ FieldName: 'ga:pageviews', sortOrder: 'DESCENDING' }],
    });

    const [analyticsData, setAnalyticsData] = useState({
        arrayOfData: [],
    });

    const [dimensions, setDimensions] = useState([]);
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const payload = { ...formData };
        _logger('ViewCharts component payload', payload);
        if (props.isDates === true) {
            payload.metrics = 'ga:pageviews';
            payload.dimensions = 'ga:pagePath';
            payload.order = [];
            payload.order.push({
                FieldName: 'ga:pageviews',
                sortOrder: 'DESCENDING',
            });
            payload.dateRanges = [];
            payload.dateRanges.push({
                startDate: props.initialDates.startDate,
                endDate: props.initialDates.endDate,
            });

            googleAnalytics.createAnalytics(payload).then(onGetAnalyticsSuccess).catch(onGetAnalyticsErr);
        } else {
            googleAnalytics.createAnalytics(currentInfo).then(onGetAnalyticsSuccess).catch(onGetAnalyticsErr);
        }
    }, [props.isDates]);

    const onGetAnalyticsErr = (err) => {
        _logger('get err ->', err);
        toastr.error('Oops, something went wrong when fetching pageviews data.');
    };

    const onGetAnalyticsSuccess = (response) => {
        _logger('ViewCharts get resp ->', response.item.reports);
        const reports = response.item.reports;
        setAnalyticsData((prevState) => {
            const ps = { ...prevState };
            ps.arrayOfData = reports.map(mappedData);
            return ps;
        });
    };

    const mappedData = (analytics) => {
        _logger('ViewCharts mappedData', analytics.data.rows);
        const rows = analytics.data.rows;
        const data = rows.filter((f) => f.metrics[0].values > 50);
        setDimensions(data.map((d) => d.dimensions));
        setMetrics(data.map((m) => parseInt(m.metrics[0].values)));

        let mappedCols = data.map((data, index) => {
            return (
                <tr key={index}>
                    <td>
                        <a href={data.dimensions[0]} className="text-muted">
                            {data.dimensions[0]}
                        </a>
                    </td>
                    <td>{data.metrics[0].values[0]}</td>
                </tr>
            );
        });

        return mappedCols;
    };

    const apexOpts = {
        grid: {
            padding: {
                left: 15,
                right: 0,
            },
        },
        chart: {
            height: 150,
            type: 'bar',
            stacked: true,
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: '22%',
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            offsetY: -24,
            style: {
                fontSize: '12px',
                colors: ['#98a6ad'],
            },
        },
        zoom: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        colors: ['#0acf97'],
        xaxis: {
            categories: dimensions,
            labels: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: true,
            },
            title: {
                text: 'Page Path',
            },
        },
        yaxis: {
            labels: {
                show: true,
            },
            title: {
                text: 'Views',
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                inverseColors: !0,
                shade: 'light',
                type: 'horizontal',
                shadeIntensity: 0.25,
                gradientToColors: void 0,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
            },
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                },
            },
        },
    };

    const apexData = [
        {
            name: 'Views',
            data: metrics,
        },
    ];
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <Card>
                <Card.Body>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title="Views Per Page"
                        menuItems={[{ label: 'Refresh Report' }, { label: 'Export Report' }]}
                    />
                    <Chart options={apexOpts} series={apexData} type="bar" height={400} className="apex-charts mt-2" />

                    <Card.Body>
                        <Button color="primary" className="ms-1" type="button" onClick={toggle}>
                            View More Details
                        </Button>

                        <Collapse in={isOpen}>
                            <div className="table-responsive mt-3">
                                <table className="table table-sm table-admin mb-0 font-13">
                                    <thead>
                                        <tr>
                                            <th>Page</th>
                                            <th>Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>{analyticsData.arrayOfData}</tbody>
                                </table>
                            </div>
                        </Collapse>
                    </Card.Body>
                </Card.Body>
            </Card>
        </>
    );
};
ViewsChart.propTypes = {
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

export default ViewsChart;
