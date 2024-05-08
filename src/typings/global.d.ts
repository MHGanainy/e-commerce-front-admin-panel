interface ServerErrorResponse {
  timestamp?: String;
  status: Number;
  error: String;
  message: String;
  trace?: String;
  path?: String;
}
