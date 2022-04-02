local port = 8080 -- Changeable
local HttpService = game:GetService("HttpService")
repeat
	task.wait()
until game:IsLoaded()
local websocket = (Krnl and Krnl.WebSocket) or (syn and syn.websocket) or WebSocket or nil
assert(websocket, "Missing Library: <WebSocket>")
pcall(function()
	local socket = websocket.connect("ws://localhost:" .. port)
	socket.OnMessage:Connect(function(script)
		local success, call = pcall(loadstring, script)

		if not success or typeof(call) == 'string' then
			socket:Send(HttpService:JSONEncode({
				type = 'error',
				message = tostring(call)
			}))
		end

		local s,r = pcall(call)
		if not s then
			socket:Send(HttpService:JSONEncode({
				type = "error",
				message = tostring(r)
			}))
		end
	end)

	socket.OnClose:Connect(function()
		warn'WebSocket Disconnected.'
	end)
end)