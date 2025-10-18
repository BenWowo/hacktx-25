from fastapi import FastAPI

app = FastAPI()

@app.get("/calculate")
def calculate(amount_financed: float, yearly_apr: float, months: int) -> float:
    """
    Calculate the monthly interest rate
    """
    monthly_apr = yearly_apr / 12
    return amount_financed * ((monthly_apr)(1+(monthly_apr)**months) / ((1 + (monthly_apr) ** months) - 1))
