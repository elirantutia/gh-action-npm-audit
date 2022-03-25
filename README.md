# Github Action - NPM Audit

Execute `npm audit` command and pass a relevant output if a vulnerability exists.

## Inputs

| Name              | Type    | Required | Default | Values                        | Description                             |
|-------------------|---------|----------|---------|-------------------------------|-----------------------------------------|
| sensitivity-level | string  | false    | low     | low, moderate, high, critical | Sensitivity level of the security audit |
| production        | boolean | false    | true    |                               | Execute npm audit with production flag  |

## Outputs
| Name   | Type    | Description                 |
|--------|---------|-----------------------------|
| found  | boolean | If a vulnerability exists   |
| report | string  | Summary of the audit report |


## Example usage

```
uses: actions/reviewer-chooser@v1.1
with:
  sensitivity-level: info
  production: true
```