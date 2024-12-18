--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: mein
--

CREATE TABLE public.permissions (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    guard_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.permissions OWNER TO mein;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: mein
--

CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO mein;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mein
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: role_has_permissions; Type: TABLE; Schema: public; Owner: mein
--

CREATE TABLE public.role_has_permissions (
    permission_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.role_has_permissions OWNER TO mein;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: mein
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    guard_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.roles OWNER TO mein;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: mein
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO mein;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mein
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: mein
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    nip character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    username character varying(255),
    is_admin character varying(255) DEFAULT '0'::character varying NOT NULL,
    master_business_partner_id character varying(255),
    role_id bigint,
    division_id bigint,
    position_id bigint,
    departement_id bigint,
    is_approval boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO mein;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mein
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO mein;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mein
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: mein
--

COPY public.permissions (id, name, guard_name, created_at, updated_at) FROM stdin;
146	dashboard view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
147	reimburse create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
148	reimburse view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
149	reimburse update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
150	reimburse delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
151	business trip request create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
152	business trip request view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
153	business trip request update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
154	business trip request delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
155	business trip declaration create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
156	business trip declaration view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
157	business trip declaration update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
158	business trip declaration delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
159	purchase requisition create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
160	purchase requisition view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
161	purchase requisition update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
162	purchase requisition delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
163	setting create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
164	setting view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
165	setting update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
166	setting delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
167	secret create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
168	secret view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
169	secret update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
170	secret delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
171	api view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
172	api create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
173	api update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
174	api delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
175	approval create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
176	approval view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
177	approval update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
178	approval delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
179	user create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
180	user view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
181	user update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
182	user delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
183	role permission create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
184	role permission view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
185	role permission update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
186	role permission delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
187	role create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
188	role view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
189	role update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
190	role delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
191	master sap material create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
192	master sap material view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
193	master sap material update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
194	master sap material delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
195	master sap asset create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
196	master sap asset view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
197	master sap asset update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
198	master sap asset delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
199	master sap cost center create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
200	master sap cost center view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
201	master sap cost center update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
202	master sap cost center delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
203	master sap internal order create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
204	master sap internal order view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
205	master sap internal order update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
206	master sap internal order delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
207	master sap recon account create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
208	master sap recon account view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
209	master sap recon account update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
210	master sap recon account delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
211	master sap bank key create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
212	master sap bank key view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
213	master sap bank key update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
214	master sap bank key delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
215	master sap business partner create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
216	master sap business partner view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
217	master sap business partner update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
218	master sap business partner delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
219	master pr document type create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
220	master pr document type view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
221	master pr document type update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
222	master pr document type delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
223	master pr valuation type create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
224	master pr valuation type view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
225	master pr valuation type update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
226	master pr valuation type delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
227	master pr purchasing group create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
228	master pr purchasing group view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
229	master pr purchasing group update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
230	master pr purchasing group delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
231	master pr account assignment category create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
232	master pr account assignment category view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
233	master pr account assignment category update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
234	master pr account assignment category delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
235	master pr item category create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
236	master pr item category view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
237	master pr item category update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
238	master pr item category delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
239	master pr storage location create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
240	master pr storage location view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
241	master pr storage location update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
242	master pr storage location delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
243	master pr material group create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
244	master pr material group view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
245	master pr material group update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
246	master pr material group delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
247	master pr uom create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
248	master pr uom view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
249	master pr uom update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
250	master pr uom delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
251	master pr tax create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
252	master pr tax view	web	2024-11-23 05:46:25	2024-11-23 05:46:25
253	master pr tax update	web	2024-11-23 05:46:25	2024-11-23 05:46:25
254	master pr tax delete	web	2024-11-23 05:46:25	2024-11-23 05:46:25
255	master business trip allowance category create	web	2024-11-23 05:46:25	2024-11-23 05:46:25
256	master business trip allowance category view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
257	master business trip allowance category update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
258	master business trip allowance category delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
259	master business trip allowance item create	web	2024-11-23 05:46:26	2024-11-23 05:46:26
260	master business trip allowance item view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
261	master business trip allowance item update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
262	master business trip allowance item delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
263	master business trip purpose type create	web	2024-11-23 05:46:26	2024-11-23 05:46:26
264	master business trip purpose type view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
265	master business trip purpose type update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
266	master business trip purpose type delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
267	master business trip grade create	web	2024-11-23 05:46:26	2024-11-23 05:46:26
268	master business trip grade view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
269	master business trip grade update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
270	master business trip grade delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
271	master business trip destination create	web	2024-11-23 05:46:26	2024-11-23 05:46:26
272	master business trip destination view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
273	master business trip destination update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
274	master business trip destination delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
275	master reimburse type create	web	2024-11-23 05:46:26	2024-11-23 05:46:26
276	master reimburse type view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
277	master reimburse type update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
278	master reimburse type delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
279	master reimburse period create	web	2024-11-23 05:46:26	2024-11-23 05:46:26
280	master reimburse period view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
281	master reimburse period update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
282	master reimburse period delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
283	master reimburse quota create	web	2024-11-23 05:46:26	2024-11-23 05:46:26
284	master reimburse quota view	web	2024-11-23 05:46:26	2024-11-23 05:46:26
285	master reimburse quota update	web	2024-11-23 05:46:26	2024-11-23 05:46:26
286	master reimburse quota delete	web	2024-11-23 05:46:26	2024-11-23 05:46:26
287	position view	web	2024-11-24 04:11:57	2024-11-24 04:11:57
288	position create	web	2024-11-24 04:12:24	2024-11-24 04:12:24
289	position update	web	2024-11-24 04:12:34	2024-11-24 04:12:34
290	position delete	web	2024-11-24 04:12:48	2024-11-24 04:12:48
291	division create	web	2024-11-24 07:44:54	2024-11-24 07:44:54
292	division view	web	2024-11-24 07:45:02	2024-11-24 07:45:02
293	division update	web	2024-11-24 07:45:10	2024-11-24 07:45:10
294	division delete	web	2024-11-24 07:45:18	2024-11-24 07:45:18
295	department view	web	2024-11-24 07:56:51	2024-11-24 07:56:51
296	department create	web	2024-11-24 07:57:04	2024-11-24 07:57:04
297	department update	web	2024-11-24 07:57:14	2024-11-24 07:57:14
298	department delete	web	2024-11-24 07:57:23	2024-11-24 07:57:23
314	tracking number choose delete	web	2024-11-25 01:40:52	2024-11-25 01:40:52
313	tracking number choose update	web	2024-11-25 01:40:44	2024-11-25 01:40:44
312	tracking number choose view	web	2024-11-25 01:40:34	2024-11-25 01:40:34
311	tracking number choose create	web	2024-11-25 01:40:20	2024-11-25 01:40:20
310	tracking number auto delete	web	2024-11-25 01:18:55	2024-11-25 01:18:55
309	tracking number auto update	web	2024-11-25 01:18:47	2024-11-25 01:18:47
308	tracking number auto view	web	2024-11-25 01:18:39	2024-11-25 01:18:39
307	tracking number auto create	web	2024-11-25 01:18:27	2024-11-25 01:18:27
306	approval pr delete	web	2024-11-25 00:30:56	2024-11-25 00:30:56
305	approval pr create	web	2024-11-25 00:30:43	2024-11-25 00:30:43
304	approval pr update	web	2024-11-25 00:30:32	2024-11-25 00:30:32
303	approval pr view	web	2024-11-25 00:30:23	2024-11-25 00:30:23
302	tracking number delete	web	2024-11-24 09:34:49	2024-11-24 09:34:49
301	tracking number update	web	2024-11-24 09:34:40	2024-11-24 09:34:40
300	tracking number view	web	2024-11-24 09:34:33	2024-11-24 09:34:33
299	tracking number create	web	2024-11-24 09:34:25	2024-11-24 09:34:25
\.


--
-- Data for Name: role_has_permissions; Type: TABLE DATA; Schema: public; Owner: mein
--

COPY public.role_has_permissions (permission_id, role_id) FROM stdin;
146	11
147	11
148	11
149	11
150	11
151	11
152	11
153	11
154	11
155	11
156	11
157	11
158	11
159	11
160	11
161	11
162	11
163	11
164	11
165	11
166	11
167	11
168	11
169	11
170	11
171	11
172	11
173	11
174	11
175	11
176	11
177	11
178	11
179	11
180	11
181	11
182	11
183	11
184	11
185	11
186	11
187	11
188	11
189	11
190	11
191	11
192	11
193	11
194	11
195	11
196	11
197	11
198	11
199	11
200	11
201	11
202	11
203	11
204	11
205	11
206	11
207	11
208	11
209	11
210	11
211	11
212	11
213	11
214	11
215	11
216	11
217	11
218	11
219	11
220	11
221	11
222	11
223	11
224	11
225	11
226	11
227	11
228	11
229	11
230	11
231	11
232	11
233	11
234	11
235	11
236	11
237	11
238	11
239	11
240	11
241	11
242	11
243	11
244	11
245	11
246	11
247	11
248	11
249	11
250	11
251	11
252	11
253	11
254	11
255	11
256	11
257	11
258	11
259	11
260	11
261	11
262	11
263	11
264	11
265	11
266	11
267	11
268	11
269	11
270	11
271	11
272	11
273	11
274	11
275	11
276	11
277	11
278	11
279	11
280	11
281	11
282	11
283	11
284	11
285	11
286	11
287	11
288	11
289	11
290	11
291	11
292	11
293	11
294	11
295	11
296	11
297	11
298	11
314	11
313	11
312	11
311	11
310	11
309	11
308	11
307	11
306	11
305	11
304	11
303	11
302	11
301	11
300	11
299	11
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: mein
--

COPY public.roles (id, name, guard_name, created_at, updated_at) FROM stdin;
1	Admin - Reimbursement	web	2024-11-04 13:15:37	2024-11-04 13:15:37
11	superAdmin	web	2024-11-02 11:22:34	2024-11-23 04:38:23
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mein
--

COPY public.users (id, nip, name, email, email_verified_at, password, remember_token, created_at, updated_at, username, is_admin, master_business_partner_id, role_id, division_id, position_id, departement_id, is_approval) FROM stdin;
4	c2ddcdae-8507-317e-80b2-5ee275ba1eaa	olson.maxie@example.net	marquardt.verda@raynor.net	2024-11-04 04:45:59	$2y$12$wc8ArJyewEr.Q5kjfFzcROxeHvPxOrs3nOQ8h7ExgSKQbg2VKJqzq	\N	2024-11-04 04:46:00	2024-11-04 04:46:00	\N	0	\N	\N	\N	\N	\N	f
5	fb98b387-d23f-363a-b077-2e92f53bc9af	lweber@example.net	mabel.shields@brekke.org	2024-11-04 04:46:00	$2y$12$CYgSFczHqWSHSJmpWuV76.ceYYWwxeC40Fz4oZEYeuQJKFjunGyvO	\N	2024-11-04 04:46:00	2024-11-04 04:46:00	\N	0	\N	\N	\N	\N	\N	f
6	d91ccef7-2e88-3f04-9dbc-34f0824431b0	isac98@example.org	kreiger.cory@hotmail.com	2024-11-04 04:46:00	$2y$12$ypSkvsEfzBnmuYUFGRcRPuHr6tYOaJTndC.a/bGxyEXclbxCvepLG	\N	2024-11-04 04:46:01	2024-11-04 04:46:01	\N	0	\N	\N	\N	\N	\N	f
7	611e6176-984d-3ccb-b190-95b1c4664513	julian.stroman@example.org	harley93@yahoo.com	2024-11-04 04:46:01	$2y$12$wFcZa3.BqG3RHYMkxIZ7WudRcWlWXx4dIz3pkD97rDTwJHTURnkZy	\N	2024-11-04 04:46:01	2024-11-04 04:46:01	\N	0	\N	\N	\N	\N	\N	f
8	6afc2d9f-1470-3f2b-8acc-03aa3c007873	drake48@example.net	vcruickshank@yahoo.com	2024-11-04 04:46:01	$2y$12$U3n49tHWLiurPQjasul46OGM2ApHoEDwTi49PPuBm3HulQVEKg2r6	\N	2024-11-04 04:46:01	2024-11-04 04:46:01	\N	0	\N	\N	\N	\N	\N	f
9	f2429dd3-2bdb-3fe0-a31c-6a75069a9f25	kari.mraz@example.net	vallie60@gmail.com	2024-11-04 04:46:01	$2y$12$14C8T7hcOYeZODnGVzSIy.lYRVEZYkmduD0FhSo509TNVZQK2VBRi	\N	2024-11-04 04:46:02	2024-11-04 04:46:02	\N	0	\N	\N	\N	\N	\N	f
10	d253d6af-7c93-3a2b-b093-b3784bc4f6ca	eoconner@example.org	barrows.kailee@damore.com	2024-11-04 04:46:02	$2y$12$7UQgdW4A2qmXa619RPUNceBMCJI/h4oPaqzbutIICHuFfzQK3BoTe	\N	2024-11-04 04:46:02	2024-11-04 04:46:02	\N	0	\N	\N	\N	\N	\N	f
11	f91b67a2-25e8-3c86-bff4-7816444897f2	sebastian95@example.com	ariane.kautzer@hotmail.com	2024-11-04 04:46:02	$2y$12$XyT3JALNjkQ82WJbm3s7uOS48sP/kTSFlPF/NbaBOwKGbdlT3itle	\N	2024-11-04 04:46:02	2024-11-04 04:46:02	\N	0	\N	\N	\N	\N	\N	f
12	28bc8bcc-35be-3542-812e-a94a560d03a5	lsenger@example.org	moore.mozelle@harber.com	2024-11-04 04:46:02	$2y$12$4qe6btlrMfmYvcL6ntWDxefZmcXesu5s5iuZxldhXr6kDp40MFJGm	\N	2024-11-04 04:46:03	2024-11-04 04:46:03	\N	0	\N	\N	\N	\N	\N	f
13	58fa5d73-6fcf-31c9-86aa-667541cce0ff	mohamed.leuschke@example.org	tyrel84@gmail.com	2024-11-04 04:46:03	$2y$12$fRZPOkG5mozlszNg77dCI.6lpaNo.h6dKwXwyt17VpwMbrSp.9wnW	\N	2024-11-04 04:46:03	2024-11-04 04:46:03	\N	0	\N	\N	\N	\N	\N	f
14	f90ebbef-0687-3398-8726-18581d6750ab	adaline04@example.net	heathcote.bernice@yahoo.com	2024-11-04 04:46:03	$2y$12$9KYveDTVu79zUyFRNy7P0./2JWh7VYWRzycvj6lRfyHYSaV7XbaXy	\N	2024-11-04 04:46:03	2024-11-04 04:46:03	\N	0	\N	\N	\N	\N	\N	f
15	46aec8dd-2948-3b74-bc9e-224b857e4ece	clair.ullrich@example.com	kay45@yahoo.com	2024-11-04 04:46:03	$2y$12$O0.QXd82kaQ65rsY.RzFSeendxMIi68VkH2Qm9q7OdO/7Bm8ReuMa	\N	2024-11-04 04:46:04	2024-11-04 04:46:04	\N	0	\N	\N	\N	\N	\N	f
16	e1acb6c1-36ea-3d8c-98d2-e8a550bd596a	lucienne.altenwerth@example.com	ullrich.jacques@gmail.com	2024-11-04 04:46:04	$2y$12$nPgoBraO.PomsgjmIsENUOUh29QLPnC5b4FPK2JJmNdcvbUl8zGAi	\N	2024-11-04 04:46:04	2024-11-04 04:46:04	\N	0	\N	\N	\N	\N	\N	f
17	bd820c2a-176c-3d23-b8c0-1ea0d13943b8	yhaag@example.com	haley.eugenia@lemke.net	2024-11-04 04:46:04	$2y$12$lSL6yOqKxhkRfdHar.EJ9OGEOFMo/pGmlSoXPHg8USlwHorQtdbSS	\N	2024-11-04 04:46:05	2024-11-04 04:46:05	\N	0	\N	\N	\N	\N	\N	f
18	f32d3f97-a432-3d09-ada5-0d7cadd6ee46	winona.jerde@example.net	anjali.auer@hotmail.com	2024-11-04 04:46:05	$2y$12$VXuEPf12Aw71PzswNBp9kOHkI/9ebMQc6YOrZapc53IH2XhQgXmou	\N	2024-11-04 04:46:05	2024-11-04 04:46:05	\N	0	\N	\N	\N	\N	\N	f
19	bbfab868-f89f-367f-8833-b693f2ced52d	ignacio75@example.com	antonette33@hotmail.com	2024-11-04 04:46:05	$2y$12$ekdwWr3.MMX6Us44KQNHmOmP67otwMind8e46aEJXdGNUNLEAEGPK	\N	2024-11-04 04:46:05	2024-11-04 04:46:05	\N	0	\N	\N	\N	\N	\N	f
20	6e7cdd79-a69d-3924-950f-473ffa238210	alba12@example.org	yazmin.nienow@yahoo.com	2024-11-04 04:46:05	$2y$12$4XucFu42pMaFbS9ry2f6Z.2QM27GPpXdHlyj4FN6vYcMXU.XLcGxm	\N	2024-11-04 04:46:06	2024-11-04 04:46:06	\N	0	\N	\N	\N	\N	\N	f
21	a906a6f6-d7b5-391b-b407-9869dcfe5003	darius.willms@example.net	wilber85@moore.com	2024-11-04 04:46:06	$2y$12$C0Qq9fXUdI39DyxQkx03YerwstvGEWznL2ronTJPC5hb4Ak0iBLpm	\N	2024-11-04 04:46:06	2024-11-04 04:46:06	\N	0	\N	\N	\N	\N	\N	f
22	8a041341-b0b7-3ade-b520-f673403c4100	eda88@example.com	bayer.art@yahoo.com	2024-11-04 04:46:06	$2y$12$Mn4YCKspJx6.1m30YEMPquEWM2IPc.23HT57yUZ7xRGddZA65k4Rm	\N	2024-11-04 04:46:07	2024-11-04 04:46:07	\N	0	\N	\N	\N	\N	\N	f
23	11e4f5b9-f564-3dec-ad57-16276ee9a472	cordelia24@example.net	bswift@volkman.net	2024-11-04 04:46:07	$2y$12$bZw1YQO53z/Rx1siLWihjOiZyC8L.E/qCi3ewGty3yLwVHaPs80W2	\N	2024-11-04 04:46:07	2024-11-04 04:46:07	\N	0	\N	\N	\N	\N	\N	f
1	00001	John Doe	direktur@gmail.com	2024-11-04 04:45:58	$2y$12$3MUSIXU0VyHEiNkieKOPhub0Zag0LScs8LUZpM3B7c.ghq5BBekSC	\N	2024-11-04 04:45:58	2024-11-12 05:02:06	bos	0	1601	11	\N	\N	\N	t
2	23456	John	manager@gmail.com	2024-11-04 04:45:58	$2y$12$T4uWd8hl4nGLiJQASXFPTegnsLhTAj5Bw1ohUH6HpZyn3C5JNDg3W	6w1GkVe1Q3OqjnMMKvuNpJbTBC1LzfGfNajz6Th3DglxK0dmaEOsLCH5X7j7	2024-11-04 04:45:59	2024-11-04 04:45:59	admin	0	\N	11	\N	\N	\N	t
3	12345	Doe	staff@gmail.com	2024-11-04 04:45:59	$2y$12$XJqHqV.fHwV0abTWJNIo2enzCAzmJWH29f57/pKgwg5bbdP4AOZUG	l068LpD4iC7TdLfuqHxuheIEN92Dy0RuM2ksrQqDPzhHFCD2kdbCYwKrsNaF	2024-11-04 04:45:59	2024-11-12 05:02:25	staff	0	1597	11	\N	\N	\N	t
\.


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mein
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mein
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mein
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: permissions permissions_name_guard_name_unique; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_guard_name_unique UNIQUE (name, guard_name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: role_has_permissions role_has_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_pkey PRIMARY KEY (permission_id, role_id);


--
-- Name: roles roles_name_guard_name_unique; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_guard_name_unique UNIQUE (name, guard_name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_nip_unique; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nip_unique UNIQUE (nip);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: role_has_permissions role_has_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_has_permissions role_has_permissions_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: users users_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: mein
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

