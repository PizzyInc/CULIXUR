import os
import aws_cdk as cdk
from stack import CulixurServerlessStack

app = cdk.App()
CulixurServerlessStack(app, "CulixurServerlessStack",
    env=cdk.Environment(account=os.getenv('CDK_DEFAULT_ACCOUNT'), region=os.getenv('CDK_DEFAULT_REGION')),
)

app.synth()
