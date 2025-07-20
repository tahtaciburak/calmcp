# 🍎 CalMCP - AI-Powered Nutrition Coach

> **Model Context Protocol meets Smart Health Tracking**  
> Transform your nutrition journey with Claude AI integration and real-time health insights

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue?style=for-the-badge)](https://your-demo-url.com)
[![GitHub](https://img.shields.io/badge/⭐-Star%20on%20GitHub-yellow?style=for-the-badge)](https://github.com/tahtaciburak/calmcp)
[![MCP Protocol](https://img.shields.io/badge/🤖-MCP%20Compatible-green?style=for-the-badge)](https://modelcontextprotocol.io)

---

## 🎯 **What is CalMCP?**

CalMCP is a revolutionary nutrition tracking platform that bridges the gap between traditional calorie counting and AI-powered health coaching. By leveraging Anthropic's **Model Context Protocol (MCP)**, CalMCP seamlessly integrates with **Claude AI** to provide personalized, intelligent nutrition guidance.

### 🌟 **Why CalMCP?**

- 🔗 **Direct Claude AI connection** for personalized advice
- 📊 **Real-time macro tracking** with intelligent insights
- 🤖 **First-ever MCP integration** for nutrition tracking
- 🎯 **Goal-oriented approach** tailored to your lifestyle

---

## ✨ **Key Features**

| Feature | Description | Demo |
|---------|-------------|------|
| 🔥 **Smart Calorie Tracking** | Automated calorie calculation with macro breakdown | ![Calorie Demo](https://via.placeholder.com/100x60/4F46E5/white?text=📊) |
| 🤖 **Claude AI Integration** | Ask questions, get personalized nutrition advice | ![AI Demo](https://via.placeholder.com/100x60/10B981/white?text=🤖) |
| 💪 **Exercise Monitoring** | Track workouts and calories burned | ![Exercise Demo](https://via.placeholder.com/100x60/EF4444/white?text=💪) |
| 📈 **Progress Analytics** | Visual insights into your health journey | ![Analytics Demo](https://via.placeholder.com/100x60/F59E0B/white?text=📈) |
| 🎯 **Goal Setting** | Personalized targets based on your profile | ![Goals Demo](https://via.placeholder.com/100x60/8B5CF6/white?text=🎯) |

---

## 🚀 **Live Demo**

### Try CalMCP Now!
1. **Visit**: [calmcp.vercel.app](https://calmcp.vercel.app)
2. **Sign in** with Google
3. **Set up** your profile
4. **Start tracking** your nutrition
5. **Ask Claude** for personalized advice!

### Sample Claude Conversations:
```
You: "What should I eat to reach my protein goals today?"
Claude: "Based on your current intake of 45g protein out of 120g target, 
I recommend adding grilled chicken (25g), Greek yogurt (15g), and almonds (6g) 
to reach your goal while staying within your calorie budget."
```

---

## 🛠 **Tech Stack**

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

</div>

### 🏗 **Architecture**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js Web   │    │   MCP Server     │    │   Claude AI     │
│   Application   │◄──►│   (Python)       │◄──►│   Integration   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   RESTful API    │    │   Real-time     │
│   Database      │    │   Endpoints      │    │   Insights      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🎮 **Quick Start**

### 1. **Clone & Install**
```bash
git clone https://github.com/tahtaciburak/calmcp.git
cd calmcp

# MCP Server
cd mcp
uv sync
uv run main.py
```

### 2. **Configure Claude Desktop**
```json
{
	"mcpServers": {
		"calmcp": {
			"command": "uv",
			"args": [
				"--directory",
				"/Users/<YOUR_USERNAME_HERE>/Desktop/calmcp/mcp",
				"run",
				"main.py"
			],
			"env": {
				"AUTH_TOKEN":"<YOUR_MCP_KEY_HERE>"
			}
		}
	}
}
```

### 3. **Start Tracking!**
- 📝 Log your meals and exercises
- 🎯 Set personalized goals
- 🤖 Chat with Claude for nutrition advice
- 📊 Monitor your progress

---

## 📸 **Screenshots**

<div align="center">

### 🏠 Landing Page
![Landing](https://via.placeholder.com/600x300/4F46E5/white?text=Beautiful+Landing+Page)

### 📊 Dashboard
![Dashboard](https://via.placeholder.com/600x300/10B981/white?text=Comprehensive+Dashboard)

### 🤖 Claude Integration
![Claude](https://via.placeholder.com/600x300/8B5CF6/white?text=AI+Powered+Insights)

</div>

---

## 👥 **Team**

**Built with ❤️ by passionate developers during the Komunite MCP Hackathon**

- **Developer**: [Burak Tahtacı](https://github.com/tahtaciburak)
- **Developer**: [Polat Tahtacı](https://github.com/tahtacipolat)
- **Tech Stack**: Next.js, Python, MongoDB, MCP
- **Timeline**: 12 hours of intense coding

---

## 🏅 **Try It Now!**

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀-Try%20CalMCP%20Now-blue?style=for-the-badge&logoColor=white)](https://calmcp.vercel.app)

**Experience the future of AI-powered nutrition tracking!**

</div>

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if you found CalMCP interesting!**

[![GitHub stars](https://img.shields.io/github/stars/tahtaciburak/calmcp?style=social)](https://github.com/tahtaciburak/calmcp)
[![GitHub forks](https://img.shields.io/github/forks/tahtaciburak/calmcp?style=social)](https://github.com/tahtaciburak/calmcp)

</div>
