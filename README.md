
# QuickSchedule: A Full-Stack Web Application for Dynamic Revision Scheduling

**Website:** [https://www.quickschedule.net/](https://www.quickschedule.net/)

## Summary
QuickSchedule is a full-stack web application that helps students create personalized revision schedules. It integrates a range of technologies, including Django, React, and AWS, to provide an efficient and user-friendly platform for managing study time based on individual availability and exam schedules.

## Key Technologies
- **Frontend:** React, Bootstrap
- **Backend:** Django REST Framework, PostgreSQL
- **Cloud Infrastructure:** AWS (EC2, ALB, RDS, Route 53), Ansible, Terraform, Docker
- **Optimization:** Google OR-Tools

## Project Overview
QuickSchedule is designed to simplify the process of study planning by allowing students to generate schedules that align with their personal routines. The application offers features like user authentication, dynamic scheduling, and a responsive user interface.

### Key Features:
- **Automated Scheduling:** Utilizes a constrained optimization algorithm to generate personalized study plans based on available study hours, subject priorities, and exam dates.
- **User Authentication:** Provides a secure registration and login system with email verification, ensuring that users can access their schedules from any device.
- **Deployment:** Implements blue-green deployment strategies with Terraform, allowing for zero-downtime updates on AWS infrastructure.

## Architecture
The application is structured with a client-server model:
- **Frontend:** Developed with React, the frontend delivers a responsive and dynamic user interface, interacting with the backend via RESTful APIs.
- **Backend:** The backend, built on Django REST Framework, handles data management, user authentication, and scheduling logic. PostgreSQL is used as the database to store user data and schedules.
- **Cloud Infrastructure:** Hosted on AWS, the infrastructure includes an Application Load Balancer (ALB) managing traffic to EC2 instances, with a PostgreSQL database hosted on RDS. Infrastructure management and deployment are automated using Terraform and Docker.

## Algorithm Overview
The core feature of QuickSchedule is its scheduling algorithm. This algorithm leverages Google OR-Tools to allocate study topics across a specified number of days. It ensures that the study plans are feasible by considering the number of study hours available each day, the proportion of time needed for each subject, and the exam dates.

### How the Algorithm Works:
1. **Data Preparation:** Converts study date and hour data into structured formats and validates the input plans.
2. **Hour Allocation:** Assigns required study hours to each plan based on its fractional importance.
3. **Viability Check:** Ensures that the allocated hours are feasible within the given schedule.
4. **Topic Splitting:** Breaks down topics requiring more than one hour into single-hour increments for more granular scheduling.
5. **Constraint Satisfaction:** Uses constraint programming to assign topics to specific days, ensuring that all constraints are met.
6. **Optimisation**: Minimizes the difference between the scheduled day for each topic and the topic's exam date, particularly focusing on ensuring that topics scheduled closer to the exam date are prioritized.
7. **Schedule Creation:** Generates the final schedule by converting OR-Tools variables into specific day assignments for each topic.

This comprehensive algorithm ensures that students receive a study plan tailored to their individual needs, maximizing efficiency and effectiveness.

## Conclusion
QuickSchedule demonstrates a robust integration of front-end, back-end, and cloud technologies to solve a real-world problem. The project showcases my ability to design, develop, and deploy a full-stack application, highlighting key skills in modern web development and cloud infrastructure management.
