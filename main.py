from fastapi import FastAPI
from typing import Union
import numpy as np


app = FastAPI()

@app.get("/calculatefinance/")
def calculate(vehicle_value: int, apr: float, months: int, downpayment: int) -> float:
    """
    Calculate the monthly interest rate
    """
    monthly_apr = (apr/100) / 12
    loan = vehicle_value - downpayment

    if monthly_apr == 0:
        return loan / months

    payment = loan * (monthly_apr * (1 + monthly_apr)**months) / ((1 + monthly_apr)**months - 1)

    return np.float64(payment)

@app.get("/calculatelease/")
def calculate_lease(msrp: float, apr: float, term_months: int, downpayment: float) -> float:
    """
    Calculate Toyota-style monthly lease payment.
    Takes only MSRP, APR, lease term, and down payment.
    Assumes standard Toyota Financial values for the rest.
    """
    # --- Assumed standard values ---
    residual_percent = 60        # Residual value as % of MSRP (typical)
    cap_cost_discount = 0.05     # Negotiated price ~5% below MSRP
    acquisition_fee = 650        # Typical Toyota Financial acquisition fee
    tax_rate = 0.0625            # Average sales tax (6.25%)

    # --- Compute derived values ---
    cap_cost = msrp * (1 - cap_cost_discount) + acquisition_fee
    adjusted_cap_cost = cap_cost - downpayment
    residual_value = msrp * (residual_percent / 100)

    # --- Convert APR to Money Factor ---
    money_factor = apr / 2400

    # --- Lease payment formula ---
    depreciation_fee = (adjusted_cap_cost - residual_value) / term_months
    finance_charge = (adjusted_cap_cost + residual_value) * money_factor
    base_payment = depreciation_fee + finance_charge
    total_payment = base_payment * (1 + tax_rate)

    # --- Return as double precision float ---
    return np.float64(total_payment)
