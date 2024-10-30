<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Onduty Request</title>
    <style>
        * {
            box-sizing: border-box
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .container {
            width: 100%;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        h2 {
            text-align: center;
        }

        .status-approved {
            color: green;
            font-weight: bold;
        }

        .info-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 5px;
        }

        .detail-table, .value-table {
            margin-top: 10px;
            border-collapse: collapse;
            text-align: left;
        }

        .detail-table th, .detail-table td,
        .value-table th, .value-table td {
            border: 1px solid #ddd;
            padding: 5px;
        }

        .value-table caption {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .tables-wrapper {
            display: flex;
            gap: 20px;
        }

        .value-table td:nth-child(1),
        .value-table th:nth-child(1) {
            width: 50%;
        }

        .value-table th {
            background-color: #f2f2f2;
        }

        .total-row {
            font-weight: bold;
        }

        .tabs {
            display: flex;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        .tab-button {
            padding: 10px 20px;
            cursor: pointer;
            background-color: #f1f1f1;
            border: 1px solid #ddd;
            border-bottom: none;
        }

        .tab-button.active {
            background-color: #ffffff;
            border-top: 2px solid #333;
        }

        .tab-content {
            display: none;
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #ffffff;
        }

        .tab-content.active {
            display: block;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Attendance Onduty Request</h2>
    <p><strong>Request No.:</strong> ODR-2023-08-0011530</p>
    <p><strong>Company:</strong> PT. Mitsubishi Electric Indonesia</p>
    <p><strong>Request for:</strong> Nofarian</p>
    <p><strong>Requested By:</strong> Nofarian</p>
    <p><strong>Status:</strong> <span class="status-approved">Fully Approved</span></p>

    <table class="info-table">
        <tr>
            <td><strong>Purpose Type</strong></td>
            <td>Domestic Sector B (Jawa & Madura)</td>
        </tr>
        <tr>
            <td><strong>Pusat Biaya</strong></td>
            <td>103 (103. IT)</td>
        </tr>
        <tr>
            <td><strong>Start Date</strong></td>
            <td>17 Aug 2023</td>
        </tr>
        <tr>
            <td><strong>End Date</strong></td>
            <td>17 Aug 2023</td>
        </tr>
        <tr>
            <td><strong>Remark</strong></td>
            <td>IPVPN Upgrade</td>
        </tr>
        <tr>
            <td><strong>Attachment File</strong></td>
            <td></td>
        </tr>
    </table>

    <div class="tabs">
        <button class="tab-button active" onclick="openTab(event, 'Semarang')">Semarang</button>
        <button class="tab-button" onclick="openTab(event, 'Jakarta')">Jakarta</button>
    </div>

    <div id="Semarang" class="tab-content active">
        <h3>Detail Semarang</h3>
        <table class="detail-table">
            <tr>
                <th>Date</th>
                <th>Shift</th>
                <th>Shift Start</th>
                <th>Shift End</th>
                <th>Actual Start</th>
                <th>Actual End</th>
            </tr>
            <tr>
                <td>17/08/2023</td>
                <td>OFF</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>08:00:00</td>
                <td>17:00:00</td>
            </tr>
        </table>
        <div class="tables-wrapper">
            <table class="value-table">
                <caption>Standard Value</caption>
                <tr>
                    <th>Item Name</th>
                    <th>Currency Code</th>
                    <th>Value</th>
                    <th>Total Days</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <td>Breakfast Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>15,000</td>
                    <td>1</td>
                    <td>15,000</td>
                </tr>
                <tr>
                    <td>Dinner Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>40,000</td>
                    <td>1</td>
                    <td>40,000</td>
                </tr>
                <tr>
                    <td>Gasoline Total (TOTAL)</td>
                    <td>IDR</td>
                    <td>0</td>
                    <td>-</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Lunch Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>30,000</td>
                    <td>1</td>
                    <td>30,000</td>
                </tr>
                <tr>
                    <td><strong>Total Standard Value</strong></td>
                    <td>IDR</td>
                    <td></td>
                    <td></td>
                    <td><strong>225,000</strong></td>
                </tr>
            </table>

            <table class="value-table">
                <caption>Requested Value</caption>
                <tr>
                    <th>Item Name</th>
                    <th>Currency Code</th>
                    <th>Value</th>
                    <th>Total Days</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <td>Breakfast Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>15,000</td>
                    <td>1</td>
                    <td>15,000</td>
                </tr>
                <tr>
                    <td>Dinner Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>40,000</td>
                    <td>1</td>
                    <td>40,000</td>
                </tr>
                <tr>
                    <td>Gasoline Total (TOTAL)</td>
                    <td>IDR</td>
                    <td>0</td>
                    <td>-</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Lunch Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>30,000</td>
                    <td>1</td>
                    <td>30,000</td>
                </tr>
                <tr>
                    <td>Other Allowances (TOTAL)</td>
                    <td>IDR</td>
                    <td>500,000</td>
                    <td>-</td>
                    <td>500,000</td>
                </tr>
                <tr>
                    <td>Pocket Money Allowance Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>140,000</td>
                    <td>1</td>
                    <td>140,000</td>
                </tr>
                <tr>
                    <td><strong>Total Requested Value</strong></td>
                    <td>IDR</td>
                    <td></td>
                    <td></td>
                    <td><strong>725,000</strong></td>
                </tr>
            </table>

            <table class="value-table">
                <caption>Declared Value</caption>
                <tr>
                    <th>Item Name</th>
                    <th>Currency Code</th>
                    <th>Value</th>
                    <th>Total Days</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <td>Breakfast Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>15,000</td>
                    <td>1</td>
                    <td>15,000</td>
                </tr>
                <tr>
                    <td>Dinner Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>40,000</td>
                    <td>1</td>
                    <td>40,000</td>
                </tr>
                <tr>
                    <td>Gasoline Total (TOTAL)</td>
                    <td>IDR</td>
                    <td>0</td>
                    <td>-</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Lunch Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>30,000</td>
                    <td>1</td>
                    <td>30,000</td>
                </tr>
                <tr>
                    <td>Other Allowances (TOTAL)</td>
                    <td>IDR</td>
                    <td>500,000</td>
                    <td>-</td>
                    <td>500,000</td>
                </tr>
                <tr>
                    <td>Pocket Money Allowance Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>140,000</td>
                    <td>1</td>
                    <td>140,000</td>
                </tr>
                <tr>
                    <td><strong>Total Requested Value</strong></td>
                    <td>IDR</td>
                    <td></td>
                    <td></td>
                    <td><strong>725,000</strong></td>
                </tr>
            </table>
        </div>
    </div>
    <div id="Jakarta" class="tab-content active">
        <h3>Detail Jakarta</h3>
        <table class="detail-table">
            <tr>
                <th>Date</th>
                <th>Shift</th>
                <th>Shift Start</th>
                <th>Shift End</th>
                <th>Actual Start</th>
                <th>Actual End</th>
            </tr>
            <tr>
                <td>17/08/2023</td>
                <td>OFF</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>08:00:00</td>
                <td>17:00:00</td>
            </tr>
        </table>
        <div class="tables-wrapper">
            <table class="value-table">
                <caption>Standard Value</caption>
                <tr>
                    <th>Item Name</th>
                    <th>Currency Code</th>
                    <th>Value</th>
                    <th>Total Days</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <td>Breakfast Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>15,000</td>
                    <td>1</td>
                    <td>15,000</td>
                </tr>
                <tr>
                    <td>Dinner Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>40,000</td>
                    <td>1</td>
                    <td>40,000</td>
                </tr>
                <tr>
                    <td>Gasoline Total (TOTAL)</td>
                    <td>IDR</td>
                    <td>0</td>
                    <td>-</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Lunch Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>30,000</td>
                    <td>1</td>
                    <td>30,000</td>
                </tr>
                <tr>
                    <td><strong>Total Standard Value</strong></td>
                    <td>IDR</td>
                    <td></td>
                    <td></td>
                    <td><strong>225,000</strong></td>
                </tr>
            </table>

            <table class="value-table">
                <caption>Requested Value</caption>
                <tr>
                    <th>Item Name</th>
                    <th>Currency Code</th>
                    <th>Value</th>
                    <th>Total Days</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <td>Breakfast Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>15,000</td>
                    <td>1</td>
                    <td>15,000</td>
                </tr>
                <tr>
                    <td>Dinner Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>40,000</td>
                    <td>1</td>
                    <td>40,000</td>
                </tr>
                <tr>
                    <td>Gasoline Total (TOTAL)</td>
                    <td>IDR</td>
                    <td>0</td>
                    <td>-</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Lunch Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>30,000</td>
                    <td>1</td>
                    <td>30,000</td>
                </tr>
                <tr>
                    <td>Other Allowances (TOTAL)</td>
                    <td>IDR</td>
                    <td>500,000</td>
                    <td>-</td>
                    <td>500,000</td>
                </tr>
                <tr>
                    <td>Pocket Money Allowance Sector B Domestic (DAILY)</td>
                    <td>IDR</td>
                    <td>140,000</td>
                    <td>1</td>
                    <td>140,000</td>
                </tr>
                <tr>
                    <td><strong>Total Requested Value</strong></td>
                    <td>IDR</td>
                    <td></td>
                    <td></td>
                    <td><strong>725,000</strong></td>
                </tr>
            </table>
        </div>
    </div>
</div>

<script>
    function openTab(event, tabName) {
        // Hide all tab contents
        let tabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = "none";
            tabContents[i].classList.remove("active");
        }

        // Remove the "active" class from all buttons
        let tabButtons = document.getElementsByClassName("tab-button");
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove("active");
        }

        // Show the current tab, and add an "active" class to the button that opened it
        document.getElementById(tabName).style.display = "block";
        document.getElementById(tabName).classList.add("active");
        event.currentTarget.classList.add("active");
    }

    // Default open first tab on page load
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector(".tab-button").click();
    });
</script>
</body>
</html>
