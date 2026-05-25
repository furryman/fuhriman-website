'use client'

import styles from './ArchitectureDiagram.module.css'

export default function ArchitectureDiagram() {
  return (
    <div className={styles.diagram}>
      {/* Row 1: Developer — entry point into the CI/CD pipeline */}
      <div className={styles.entryRow}>
        <div className={`${styles.node} ${styles.developer}`}>
          <span className={styles.nodeIcon}>&#9998;</span>
          <span className={styles.nodeLabel}>Developer</span>
          <span className={styles.nodeSub}>git push</span>
        </div>
      </div>

      <div className={styles.connector}>
        <div className={styles.vLine} />
        <span className={styles.connectorLabel}>git push</span>
      </div>

      {/* Row 2: GitHub Actions Pipeline */}
      <div className={styles.row}>
        <div className={`${styles.nodeGroup} ${styles.cicd}`}>
          <div className={styles.groupHeader}>
            <span className={styles.groupIcon}>&#9881;</span>
            GitHub Actions CI/CD &mdash; OIDC-authenticated (no static AWS keys)
          </div>
          <div className={styles.pipelineFlow}>
            <div className={styles.pipelineNode}>Lint &amp; Audit</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Build Image</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Push to Hub</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Trivy Scan</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Update Helm</div>
          </div>
          <div className={styles.pipelineSubFlow}>
            <span className={styles.pipelineSubLabel}>parallel: build-ami.yml &rarr;</span>
            <div className={styles.pipelineNode}>Packer Build</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Tag AMI</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Retain 3</div>
          </div>
        </div>
      </div>

      {/* Split connector — fanning out to 3 artifacts */}
      <div className={styles.splitConnector}>
        <div className={styles.splitCenter}>
          <div className={styles.vLine} />
        </div>
        <svg
          aria-hidden="true"
          className={styles.splitSvg}
          viewBox="0 0 600 40"
          preserveAspectRatio="none"
        >
          <path
            d="M 300 0 L 300 15 L 90 15 L 90 40"
            stroke="rgb(240 168 104 / 35%)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 300 0 L 300 15 L 300 40"
            stroke="rgb(240 168 104 / 35%)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 300 0 L 300 15 L 510 15 L 510 40"
            stroke="rgb(240 168 104 / 35%)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Row 3: Docker Hub | argocd-app-of-apps | eks-helm-charts (3 artifacts) */}
      <div className={styles.tripleRow}>
        <div className={`${styles.node} ${styles.registry}`}>
          <span className={styles.nodeIcon}>&#128230;</span>
          <span className={styles.nodeLabel}>Docker Hub</span>
          <span className={styles.nodeSub}>multi-arch image</span>
        </div>
        <div className={`${styles.node} ${styles.appOfApps}`}>
          <span className={styles.nodeIcon}>&#9883;</span>
          <span className={styles.nodeLabel}>argocd-app-of-apps</span>
          <span className={styles.nodeSub}>parent Application</span>
        </div>
        <div className={`${styles.node} ${styles.helmCharts}`}>
          <span className={styles.nodeIcon}>&#9878;</span>
          <span className={styles.nodeLabel}>eks-helm-charts</span>
          <span className={styles.nodeSub}>4 child charts</span>
        </div>
      </div>

      {/* Middle section: Docker Hub line + ArgoCD + merge into k3s */}
      <div className={styles.middleSection}>
        <svg
          aria-hidden="true"
          className={styles.middleSvg}
          viewBox="0 0 600 200"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Docker Hub dashed line — runs down the left side into k3s */}
          <path
            d="M 90 0 L 90 200"
            stroke="rgb(201 56 56 / 30%)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 4"
          />
          <text x="100" y="195" fill="rgb(240 168 104 / 90%)" fontSize="10" fontFamily="monospace">
            k3s pulls image
          </text>
          {/* app-of-apps → ArgoCD (center column) */}
          <path d="M 300 0 L 300 60" stroke="rgb(240 168 104 / 35%)" strokeWidth="2" fill="none" />
          <text x="310" y="22" fill="rgb(255 217 168 / 95%)" fontSize="10" fontFamily="monospace">
            App-of-Apps watches
          </text>
          {/* eks-helm-charts → ArgoCD */}
          <path
            d="M 510 0 L 510 30 L 320 30 L 320 60"
            stroke="rgb(240 168 104 / 35%)"
            strokeWidth="2"
            fill="none"
          />
          <text x="410" y="45" fill="rgb(255 217 168 / 95%)" fontSize="10" fontFamily="monospace">
            child Apps watch
          </text>
          {/* ArgoCD down to k3s */}
          <path
            d="M 300 140 L 300 200"
            stroke="rgb(240 168 104 / 35%)"
            strokeWidth="2"
            fill="none"
          />
          <text x="310" y="175" fill="rgb(255 217 168 / 95%)" fontSize="10" fontFamily="monospace">
            reconciles
          </text>
        </svg>
        <div className={styles.middleNode}>
          <div className={`${styles.node} ${styles.argocd}`}>
            <span className={styles.nodeIcon}>&#9851;</span>
            <span className={styles.nodeLabel}>ArgoCD</span>
            <span className={styles.nodeSub}>GitOps Engine</span>
          </div>
        </div>
      </div>

      {/* Row 5: EC2 / k3s cluster — Envoy Gateway chokepoint then workloads */}
      <div className={styles.row}>
        <div className={`${styles.nodeGroup} ${styles.cluster}`}>
          <div className={styles.groupHeader}>
            <span className={styles.groupIcon}>&#9729;</span>
            AWS EC2 t4g.medium (ARM Graviton) &mdash; k3s &mdash; Packer-built AMI &mdash; IMDSv2
            required
          </div>
          <div className={styles.clusterInner}>
            {/* Inbound traffic chokepoint */}
            <div className={styles.gatewayBand}>
              <span className={styles.gatewayIcon}>&#128274;</span>
              <div>
                <div className={styles.gatewayLabel}>
                  Envoy Gateway &ldquo;public&rdquo; &mdash; TLS terminate
                </div>
                <div className={styles.gatewaySub}>
                  multi-SAN cert: fuhriman.org &middot; www.fuhriman.org &middot;
                  argocd.fuhriman.org
                </div>
              </div>
            </div>
            <div className={styles.routesRow}>
              <div className={styles.routePill}>HTTPRoute fuhriman-website</div>
              <div className={styles.routePill}>HTTPRoute argocd-server</div>
            </div>

            <div className={styles.groupSubHeader}>Kubernetes Workloads</div>
            <div className={styles.workloads}>
              <div className={`${styles.workloadNode} ${styles.certManager}`}>
                <span className={styles.workloadIcon}>&#128274;</span>
                cert-manager
                <span className={styles.workloadSub}>Let&apos;s Encrypt</span>
              </div>
              <div className={`${styles.workloadNode} ${styles.ingress}`}>
                <span className={styles.workloadIcon}>&#127760;</span>
                envoy-gateway
                <span className={styles.workloadSub}>controller</span>
              </div>
              <div className={`${styles.workloadNode} ${styles.certManager}`}>
                <span className={styles.workloadIcon}>&#127919;</span>
                external-dns
                <span className={styles.workloadSub}>Route53 sync</span>
              </div>
              <div className={`${styles.workloadNode} ${styles.website}`}>
                <span className={styles.workloadIcon}>&#9734;</span>
                fuhriman-website
                <span className={styles.workloadSub}>Next.js</span>
              </div>
            </div>

            {/* Request flow bar (now in logical order) */}
            <div className={styles.iptablesBar}>
              Visitor &#8594; Route53 (fuhriman.org) &#8594; EIP 52.37.95.130 &#8594; Envoy Gateway
              &#8594; HTTPRoute &#8594; Workload
            </div>

            {/* Admin side path */}
            <div className={styles.adminBar}>
              Admin &#8594; AWS SSM Session Manager &#8594; EC2 shell / kubectl tunnel &mdash; no
              SSH, no public k8s API
            </div>
          </div>
        </div>
      </div>

      <div className={styles.connector}>
        <div className={styles.vLine} />
      </div>

      {/* Row 6: Output */}
      <div className={styles.row}>
        <div className={`${styles.node} ${styles.output}`}>
          <span className={styles.nodeLabel}>https://fuhriman.org</span>
        </div>
      </div>
    </div>
  )
}
