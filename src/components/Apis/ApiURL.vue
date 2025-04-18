token: {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8",
    "token_type": "bearer"
  }

get users: [
{
  "UserId": 0,
  "UserName": "string",
  "UserEmail": "user@example.com",
  "ContactNo": "string",
  "Gender": "string",
  "Password": "string",
  "FirstName": "string",
  "MiddleName": "string",
  "LastName": "string",
  "CreatedBy": "string",
  "CreatedDatetime": "2025-04-18T04:59:59.413Z",
  "RecId": 0
}
]
get users api: http://192.168.11.71:8008/users/



get tasks: http://192.168.11.71:8008/tasks/

get tasks body: [
{
  "TaskId": 0,
  "Title": "string",
  "DueDate": "2025-04-18",
  "AssignedTo": "string",
  "Description": "string",
  "Status": "ToDo",
  "Priority": "Medium",
  "OrganizationId": 2232,
  "SubOrganizationId": 2232,
  "CreatedBy": "string",
  "ModifiedBy": "string",
  "RecId": 0
}
]