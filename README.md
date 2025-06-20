# AuditIQ

**AuditIQ** is a modern banking audit trail system that tracks, summarizes, and logs financial transactions with intelligent insights. It uses a microservices architecture with gRPC for internal communication and Express for public REST APIs, making it an ideal project for backend and fintech engineers.

---

## 🚀 Features

- 🔄 **Simulated Bank Transfers** with account balance adjustments
- 🧠 **Intelligent Summarization** of transactions
- 📊 **Balance Diff Engine** to detect and log changes
- 🔒 **Simulated Authorization** to validate actions
- 🧾 **Persistent Audit Logging** with timestamped entries
- 📥 **In-Memory Transfer History API**
- 🐳 Fully **Dockerized** for easy deployment
- ✅ **CI Pipeline** via GitHub Actions

---

## 🧱 Architecture

```plaintext
               +---------+
               |  Users  |
               +----+----+
                    |
                REST API (be1)
                    |
                    v
       +-----------------------------+
       | be1: Transaction Processor  |
       | - /transfer (REST)          |
       | - /summarize                |
       | - /diff                     |
       +-------------+--------------+
                     |
          gRPC (internal comm)
                     |
       +-------------v--------------+
       | be2: Audit Microservice    |
       | - summarize(tx)            |
       | - diff(old, new)           |
       +----------------------------+


