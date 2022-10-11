import React from 'react';
import { Card, Table } from 'react-bootstrap';

const OrderHistory = () => {
    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mb-3">My Orders</h4>
                <Table className="table-centered mb-0" hover responsive>
                    <thead>
                        <tr>
                            <th>Restaurants</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>View Receipt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Chipotle</td>
                            <td>$20.99</td>
                            <td>10-04-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Dominos</td>
                            <td>$15.49</td>
                            <td>10-02-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Taco Bell</td>
                            <td>$6.09</td>
                            <td>09-28-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>The CheeseCake Factory</td>
                            <td>$35.00</td>
                            <td>09-20-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Starbucks</td>
                            <td>$10.50</td>
                            <td>09-15-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>El Pollo Loco</td>
                            <td>$21.49</td>
                            <td>09-14-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Panda Express</td>
                            <td>$12.50</td>
                            <td>09-14-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Blaze Pizza</td>
                            <td>$14.10</td>
                            <td>09-11-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Korean BBQ</td>
                            <td>$36.00</td>
                            <td>09-09-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>In-n-Out Burger</td>
                            <td>$10.50</td>
                            <td>09-07-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Starbucks</td>
                            <td>$6.30</td>
                            <td>09-05-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Its Boba Time</td>
                            <td>$4.50</td>
                            <td>09-04-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                        <tr>
                            <td>WingStop</td>
                            <td>$18.00</td>
                            <td>09-01-2022</td>
                            <td>
                                <span className="badge bg-primary">View</span>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default OrderHistory;
